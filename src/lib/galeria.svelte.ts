// Galería compartida: se carga una vez y, mientras alguien la mira, pide lo nuevo cada 25 s.
import { pedirGaleria, type Foto } from './api';

const CADA_MS = 25_000;
/** Cada tantas consultas se recarga entera, para enterarse de lo que se ocultó o borró. */
const RECARGA_COMPLETA = 10;

export type Filtro = 'todas' | 'videos' | number;

class Galeria {
  fotos = $state<Foto[]>([]);
  estado = $state<'cargando' | 'lista' | 'error'>('cargando');
  filtro = $state<Filtro>('todas');

  /** Mesas que tienen al menos una foto, en orden. */
  mesas = $derived([...new Set(this.fotos.map((f) => f.mesa).filter((m): m is number => m !== null))].sort((a, b) => a - b));
  hayVideos = $derived(this.fotos.some((f) => f.tipo === 'video'));

  visibles = $derived(
    this.filtro === 'todas'
      ? this.fotos
      : this.filtro === 'videos'
        ? this.fotos.filter((f) => f.tipo === 'video')
        : this.fotos.filter((f) => f.mesa === this.filtro),
  );

  #desde: string | undefined;
  #consultas = 0;
  #enCurso: Promise<void> | null = null;
  #observadores = 0;
  #reloj: ReturnType<typeof setTimeout> | undefined;

  /** Trae lo nuevo (o todo, la primera vez). Si ya hay una consulta en curso, espera esa. */
  actualizar(): Promise<void> {
    this.#enCurso ??= this.#consultar().finally(() => (this.#enCurso = null));
    return this.#enCurso;
  }

  async #consultar() {
    const completa = this.#desde === undefined || this.#consultas % RECARGA_COMPLETA === 0;
    try {
      const respuesta = await pedirGaleria(completa ? undefined : this.#desde);
      this.#consultas++;
      this.#desde = respuesta.ahora;
      if (completa) this.fotos = respuesta.fotos;
      else this.#sumar(respuesta.fotos);
      this.estado = 'lista';
    } catch {
      // Sin señal: se queda lo que ya se veía y se intenta en la próxima vuelta.
      if (this.estado === 'cargando') this.estado = 'error';
    }
  }

  /** Agrega fotos nuevas al principio sin repetir las que ya están. */
  #sumar(nuevas: Foto[]) {
    if (!nuevas.length) return;
    const ids = new Set(nuevas.map((f) => f.id));
    this.fotos = [...nuevas, ...this.fotos.filter((f) => !ids.has(f.id))];
  }

  /** La foto que el invitado acaba de subir aparece de inmediato, sin esperar la consulta. */
  agregar(foto: Foto) {
    this.#sumar([foto]);
  }

  /** Mientras alguien mira la galería, se actualiza sola. Devuelve la función para dejar de mirar. */
  seguir(): () => void {
    this.#observadores++;
    if (this.#observadores === 1) {
      document.addEventListener('visibilitychange', this.#alCambiarVisibilidad);
      this.#vuelta();
    }
    return () => {
      this.#observadores--;
      if (this.#observadores === 0) {
        clearTimeout(this.#reloj);
        document.removeEventListener('visibilitychange', this.#alCambiarVisibilidad);
      }
    };
  }

  #vuelta = async () => {
    clearTimeout(this.#reloj);
    if (document.hidden) return; // Pantalla bloqueada o en otra app: no gasta datos ni batería.
    await this.actualizar();
    if (this.#observadores > 0 && !document.hidden) this.#reloj = setTimeout(this.#vuelta, CADA_MS);
  };

  #alCambiarVisibilidad = () => {
    if (document.hidden) clearTimeout(this.#reloj);
    else this.#vuelta();
  };
}

export const galeria = new Galeria();
