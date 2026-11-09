// Datos de ejemplo del mockup. Se reemplazan por los reales al conectar Uppy y la API.

export const mesa = 5;
export const invitado = 'Laura Gómez';

/** Fotos que ya subieron todos los invitados (cada una es una perla del corazón). */
export const fotosSubidas = 37;
/** Perlas que caben en el corazón. */
export const perlasDelCorazon = 60;

export type EstadoSubida = 'lista' | 'subiendo' | 'espera';

export interface Subida {
  id: string;
  nombre: string;
  tamano: string;
  estado: EstadoSubida;
  /** De 0 a 1; solo cuenta cuando estado es 'subiendo'. */
  progreso: number;
}

export const subidas: Subida[] = [
  { id: 'a', nombre: 'IMG_2041.jpg', tamano: '3,8 MB', estado: 'lista', progreso: 1 },
  { id: 'b', nombre: 'IMG_2042.jpg', tamano: '4,1 MB', estado: 'lista', progreso: 1 },
  { id: 'c', nombre: 'IMG_2043.jpg', tamano: '3,5 MB', estado: 'subiendo', progreso: 0.64 },
  { id: 'd', nombre: 'Video del baile · 0:48', tamano: '52 MB', estado: 'subiendo', progreso: 0.18 },
  { id: 'e', nombre: 'IMG_2045.jpg', tamano: '4,4 MB', estado: 'espera', progreso: 0 },
];

export type Tono = 'nacar-rosa' | 'nacar-azul' | 'nacar-lila' | 'papel-hondo';

export interface Foto {
  id: string;
  mesa: number;
  tono: Tono;
  /** Duración si es video, por ejemplo "0:42". */
  video?: string;
}

const tonos: Tono[] = ['papel-hondo', 'nacar-rosa', 'nacar-azul', 'nacar-lila'];
const videos: Record<number, string> = { 1: '0:42', 8: '0:18', 15: '0:55', 26: '0:31' };

export const fotos: Foto[] = Array.from({ length: fotosSubidas }, (_, i) => ({
  id: `f${i}`,
  mesa: [5, 2, 5, 1, 3, 2, 4, 1, 3][i % 9],
  tono: tonos[(i * 3 + Math.floor(i / 3)) % tonos.length],
  video: videos[i],
}));

export const filtros = ['Todas', 'Videos', 'Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5'];
