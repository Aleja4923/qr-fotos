// Cola de subidas. Uppy sube el original directo a R2 (por partes si es un video pesado)
// y reintenta cada petición; aquí se prepara la miniatura, se sube junto al original
// y se registra la foto para que aparezca en la galería.
import Uppy from '@uppy/core';
import AwsS3, { type AwsBody } from '@uppy/aws-s3';
import { firmar, registrarFoto, type TipoMedio } from './api';
import { nuevoId } from './formato';
import { galeria } from './galeria.svelte';
import { invitado } from './invitado.svelte';
import { preparar, type Preparado } from './medios';

const MB = 1024 * 1024;
/** Esperas antes de reintentar solos cuando Uppy ya agotó sus propios reintentos. */
const REINTENTOS_MS = [4_000, 12_000, 30_000];

export type EstadoSubida = 'preparando' | 'espera' | 'subiendo' | 'guardando' | 'lista' | 'error' | 'rechazada';

export interface Subida {
  id: string;
  nombre: string;
  tamano: number;
  tipo: TipoMedio;
  estado: EstadoSubida;
  /** De 0 a 1. */
  progreso: number;
  duracion: number | null;
  /** URL local de la miniatura, para la fila. */
  vista: string | null;
  /** Por qué espera, falló o no se puede subir. */
  motivo: string | null;
}

interface Interno {
  archivo: File;
  preparado: Preparado | null;
  clave: string;
  claveMini: string | null;
  autor: string | null;
  mesa: number | null;
  uppyId: string | null;
  originalSubido: boolean;
  intentos: number;
  reloj?: ReturnType<typeof setTimeout>;
}

type MetaSubida = { miId: string; clave: string };

const TERMINADOS: EstadoSubida[] = ['lista', 'error', 'rechazada'];

function extension(archivo: File, tipo: TipoMedio): string {
  const ext = /\.([a-z0-9]{2,5})$/i.exec(archivo.name)?.[1]?.toLowerCase();
  return ext ?? (tipo === 'video' ? 'mp4' : 'jpg');
}

function carpeta(mesa: number | null): string {
  return mesa === null ? 'sin-mesa' : `mesa-${String(mesa).padStart(2, '0')}`;
}

async function subirMini(clave: string, mini: Blob) {
  const firmado = await firmar({ method: 'PUT', key: clave, contentType: 'image/jpeg' });
  const respuesta = await fetch(firmado.url, {
    method: 'PUT',
    body: mini,
    headers: { 'Content-Type': 'image/jpeg', ...firmado.headers },
  });
  if (!respuesta.ok) throw new Error(`miniatura: ${respuesta.status}`);
}

class Subidas {
  lista = $state<Subida[]>([]);
  enLinea = $state(typeof navigator === 'undefined' ? true : navigator.onLine);

  listas = $derived(this.lista.filter((s) => s.estado === 'lista').length);
  conError = $derived(this.lista.filter((s) => s.estado === 'error').length);
  rechazadas = $derived(this.lista.filter((s) => s.estado === 'rechazada').length);
  /** Hay algo en camino: la pantalla debe quedarse encendida y avisar antes de cerrar. */
  ocupado = $derived(this.lista.some((s) => !TERMINADOS.includes(s.estado)));
  terminado = $derived(this.lista.length > 0 && !this.ocupado);

  #internos = new Map<string, Interno>();
  #preparacion: Promise<void> = Promise.resolve();
  #uppy: Uppy<MetaSubida, AwsBody> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      addEventListener('online', () => (this.enLinea = true));
      addEventListener('offline', () => (this.enLinea = false));
    }
  }

  #fila(id: string): Subida | undefined {
    return this.lista.find((s) => s.id === id);
  }

  #cambiar(id: string, cambios: Partial<Subida>) {
    const fila = this.#fila(id);
    if (fila) Object.assign(fila, cambios);
  }

  get #cargador(): Uppy<MetaSubida, AwsBody> {
    if (this.#uppy) return this.#uppy;
    const uppy = new Uppy<MetaSubida, AwsBody>({ autoProceed: true, allowMultipleUploadBatches: true });
    uppy.use(AwsS3<MetaSubida, AwsBody>, {
      signRequest: firmar,
      // Con la antena del salón llena, pocas subidas a la vez se estorban menos.
      limit: 2,
      // Un video de 1 minuto pesa 60–170 MB: por partes, un corte solo repite la parte que falló.
      shouldUseMultipart: (archivo) => (archivo.size ?? 0) > 20 * MB,
      generateObjectKey: (archivo) => archivo.meta.clave,
      // Sin metadatos como encabezados: cada encabezado extra tendría que ir en la firma.
      allowedMetaFields: false,
    });

    uppy.on('upload-progress', (archivo, progreso) => {
      if (!archivo || !progreso.bytesTotal) return;
      // El último 5 % queda para la miniatura y el registro en la galería.
      const valor = (progreso.bytesUploaded / progreso.bytesTotal) * 0.95;
      this.#cambiar(archivo.meta.miId, { estado: 'subiendo', progreso: valor, motivo: null });
    });
    uppy.on('upload-success', (archivo) => {
      if (!archivo) return;
      const interno = this.#internos.get(archivo.meta.miId);
      if (!interno) return;
      interno.originalSubido = true;
      interno.intentos = 0;
      this.#terminar(archivo.meta.miId);
    });
    uppy.on('upload-error', (archivo) => {
      if (archivo) this.#fallo(archivo.meta.miId);
    });

    this.#uppy = uppy;
    return uppy;
  }

  /** Agrega los archivos elegidos. Si la tanda anterior ya terminó bien, empieza una nueva. */
  agregar(archivos: File[]) {
    if (!archivos.length) return;
    if (this.lista.length && !this.ocupado && this.conError === 0) this.#limpiar();

    for (const archivo of archivos) {
      const id = nuevoId();
      const mesa = invitado.mesa;
      this.#internos.set(id, {
        archivo,
        preparado: null,
        clave: '',
        claveMini: null,
        autor: invitado.autor,
        mesa,
        uppyId: null,
        originalSubido: false,
        intentos: 0,
      });
      this.lista.push({
        id,
        nombre: archivo.name || 'Archivo',
        tamano: archivo.size,
        tipo: archivo.type.startsWith('video/') ? 'video' : 'foto',
        estado: 'preparando',
        progreso: 0,
        duracion: null,
        vista: null,
        motivo: null,
      });
      // Una por una: decodificar varias fotos de 12 MP a la vez agota la memoria del celular.
      this.#preparacion = this.#preparacion.then(() => this.#preparar(id));
    }
  }

  async #preparar(id: string) {
    const interno = this.#internos.get(id);
    if (!interno) return; // La quitaron mientras esperaba.
    const p = await preparar(interno.archivo);
    if (!this.#internos.has(id)) return;
    interno.preparado = p;
    const ext = extension(interno.archivo, p.tipo);
    const dir = carpeta(interno.mesa);
    interno.clave = `${dir}/original/${id}.${ext}`;
    interno.claveMini = p.mini ? `${dir}/mini/${id}.jpg` : null;

    this.#cambiar(id, {
      tipo: p.tipo,
      duracion: p.duracion,
      vista: p.mini ? URL.createObjectURL(p.mini) : null,
    });

    if (p.rechazo) {
      this.#cambiar(id, { estado: 'rechazada', motivo: p.rechazo });
      return;
    }

    this.#cambiar(id, { estado: 'espera' });
    try {
      interno.uppyId = this.#cargador.addFile({
        name: `${id}.${ext}`,
        type: interno.archivo.type || (p.tipo === 'video' ? 'video/mp4' : 'image/jpeg'),
        data: interno.archivo,
        source: 'qr-fotos',
        meta: { miId: id, clave: interno.clave },
      });
    } catch {
      this.#cambiar(id, { estado: 'error', motivo: 'No se pudo agregar a la cola' });
    }
  }

  /** Original ya en R2: falta la miniatura y avisar a la galería. */
  async #terminar(id: string) {
    const interno = this.#internos.get(id);
    if (!interno?.preparado) return;
    const p = interno.preparado;
    this.#cambiar(id, { estado: 'guardando', progreso: 0.97, motivo: null });
    try {
      if (p.mini && interno.claveMini) await subirMini(interno.claveMini, p.mini);
      const foto = await registrarFoto({
        id,
        tipo: p.tipo,
        clave: interno.clave,
        claveMini: interno.claveMini,
        mesa: interno.mesa,
        autor: interno.autor,
        ancho: p.ancho,
        alto: p.alto,
        duracion: p.duracion,
      });
      galeria.agregar(foto);
      this.#cambiar(id, { estado: 'lista', progreso: 1 });
      if (interno.uppyId) this.#uppy?.removeFile(interno.uppyId);
      interno.uppyId = null;
    } catch {
      this.#fallo(id);
    }
  }

  /** Falló después de los reintentos de Uppy: espera un rato y vuelve a intentar solo. */
  #fallo(id: string) {
    const interno = this.#internos.get(id);
    if (!interno) return;
    const espera = REINTENTOS_MS[interno.intentos];
    interno.intentos++;
    if (espera === undefined) {
      this.#cambiar(id, { estado: 'error', motivo: 'No se pudo subir' });
      return;
    }
    this.#cambiar(id, { estado: 'espera', motivo: 'Reintentando en un momento' });
    clearTimeout(interno.reloj);
    interno.reloj = setTimeout(() => this.#reanudar(id), espera);
  }

  #reanudar(id: string) {
    const interno = this.#internos.get(id);
    if (!interno) return;
    if (interno.originalSubido) {
      this.#terminar(id);
    } else if (interno.uppyId) {
      this.#cambiar(id, { estado: 'espera', motivo: null });
      this.#cargador.retryUpload(interno.uppyId);
    }
  }

  /** El invitado pide reintentar: empieza de nuevo la cuenta de reintentos automáticos. */
  reintentar(id: string) {
    const interno = this.#internos.get(id);
    if (!interno) return;
    interno.intentos = 0;
    clearTimeout(interno.reloj);
    this.#reanudar(id);
  }

  reintentarTodas() {
    for (const s of this.lista) if (s.estado === 'error') this.reintentar(s.id);
  }

  quitar(id: string) {
    const interno = this.#internos.get(id);
    if (interno) {
      clearTimeout(interno.reloj);
      if (interno.uppyId) this.#uppy?.removeFile(interno.uppyId);
    }
    this.#internos.delete(id);
    const fila = this.#fila(id);
    if (fila?.vista) URL.revokeObjectURL(fila.vista);
    this.lista = this.lista.filter((s) => s.id !== id);
  }

  #limpiar() {
    for (const s of this.lista) {
      if (s.vista) URL.revokeObjectURL(s.vista);
      const interno = this.#internos.get(s.id);
      if (interno?.uppyId) this.#uppy?.removeFile(interno.uppyId);
    }
    this.#internos.clear();
    this.lista = [];
  }
}

export const subidas = new Subidas();

/** Lo que hace cualquier botón "Subir": agrega los archivos y muestra la pantalla Subiendo. */
export function subirArchivos(archivos: File[]) {
  subidas.agregar(archivos);
  if (location.hash !== '#subiendo') location.hash = '#subiendo';
}
