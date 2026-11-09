// Contrato con el Worker. En desarrollo lo responde el R2 simulado (dev/r2-simulado.ts);
// en producción, el Worker de Cloudflare con las mismas rutas y formas.
import type { AwsS3Options } from '@uppy/aws-s3';

// Uppy no exporta estos tipos por separado; se sacan de la opción signRequest.
type FirmarFn = Extract<AwsS3Options<Record<string, never>, Record<string, never>>, { signRequest: unknown }>['signRequest'];
export type PresignableRequest = Parameters<FirmarFn>[0];
export type PresignedResponse = Awaited<ReturnType<FirmarFn>>;

export type TipoMedio = 'foto' | 'video';

/** Una foto o video ya guardado, tal como lo devuelve la galería. */
export interface Foto {
  id: string;
  tipo: TipoMedio;
  /** Miniatura JPEG de 400 px; null si el celular no pudo hacerla. */
  mini: string | null;
  /** Archivo para ver en el visor. */
  url: string;
  /** Enlace que descarga el archivo (con Content-Disposition). */
  descarga: string;
  mesa: number | null;
  autor: string | null;
  /** ISO 8601. */
  hora: string;
  ancho: number | null;
  alto: number | null;
  /** Segundos, solo en videos. */
  duracion: number | null;
}

/** Lo que el celular registra después de subir el original (y la miniatura). */
export interface NuevaFoto {
  id: string;
  tipo: TipoMedio;
  clave: string;
  claveMini: string | null;
  mesa: number | null;
  autor: string | null;
  ancho: number | null;
  alto: number | null;
  duracion: number | null;
}

export interface RespuestaGaleria {
  /** Más recientes primero. */
  fotos: Foto[];
  /** Hora del servidor; se manda como `desde` en la siguiente consulta. */
  ahora: string;
}

export class ErrorApi extends Error {
  constructor(
    message: string,
    readonly estado: number,
  ) {
    super(message);
  }
}

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  const respuesta = await fetch(ruta, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json', ...init.headers } : init?.headers,
  });
  if (!respuesta.ok) throw new ErrorApi(`${ruta} respondió ${respuesta.status}`, respuesta.status);
  return respuesta.json() as Promise<T>;
}

/** Pide al Worker la URL firmada para una operación de R2 (subir, partes, completar…). */
export function firmar(peticion: PresignableRequest): Promise<PresignedResponse> {
  return pedir('/api/firmar', { method: 'POST', body: JSON.stringify(peticion) });
}

export function registrarFoto(foto: NuevaFoto): Promise<Foto> {
  return pedir('/api/fotos', { method: 'POST', body: JSON.stringify(foto) });
}

export function pedirGaleria(desde?: string): Promise<RespuestaGaleria> {
  const consulta = desde ? `?desde=${encodeURIComponent(desde)}` : '';
  return pedir(`/api/galeria${consulta}`);
}
