// Antes de subir: tipo, medidas, duración del video y miniatura JPEG de 400 px hecha en el celular.
import type { TipoMedio } from './api';
import { duracion as formatoDuracion } from './formato';

export const LADO_MINI = 400;
export const DURACION_MAXIMA = 60;
/** Si el navegador no puede leer la duración del video, se usa este tope de tamaño. */
export const TAMANO_MAXIMO_VIDEO = 200 * 1024 * 1024;

const EXT_VIDEO = /\.(mp4|mov|m4v|webm|3gp|3g2|mkv|avi)$/i;
const EXT_FOTO = /\.(jpe?g|png|gif|webp|heic|heif|avif|bmp|tiff?|dng)$/i;

export interface Preparado {
  tipo: TipoMedio;
  mini: Blob | null;
  ancho: number | null;
  alto: number | null;
  duracion: number | null;
  /** Si no se puede subir, la razón en palabras del invitado. */
  rechazo: string | null;
}

export function tipoDe(archivo: File): TipoMedio | null {
  if (archivo.type.startsWith('video/')) return 'video';
  if (archivo.type.startsWith('image/')) return 'foto';
  if (EXT_VIDEO.test(archivo.name)) return 'video';
  if (EXT_FOTO.test(archivo.name)) return 'foto';
  return null;
}

export async function preparar(archivo: File): Promise<Preparado> {
  const tipo = tipoDe(archivo);
  if (!tipo) {
    return { tipo: 'foto', mini: null, ancho: null, alto: null, duracion: null, rechazo: 'No es una foto ni un video' };
  }
  return tipo === 'foto' ? prepararFoto(archivo) : prepararVideo(archivo);
}

function lienzoMini(ancho: number, alto: number) {
  const escala = Math.min(1, LADO_MINI / Math.max(ancho, alto));
  const lienzo = document.createElement('canvas');
  lienzo.width = Math.max(1, Math.round(ancho * escala));
  lienzo.height = Math.max(1, Math.round(alto * escala));
  return lienzo;
}

function aJpeg(lienzo: HTMLCanvasElement): Promise<Blob | null> {
  // El JPEG nuevo no lleva metadatos: la miniatura pública no guarda la ubicación GPS.
  return new Promise((ok) => lienzo.toBlob(ok, 'image/jpeg', 0.8));
}

async function prepararFoto(archivo: File): Promise<Preparado> {
  const base: Preparado = { tipo: 'foto', mini: null, ancho: null, alto: null, duracion: null, rechazo: null };
  try {
    const imagen = await decodificar(archivo);
    const lienzo = lienzoMini(imagen.width, imagen.height);
    lienzo.getContext('2d')!.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
    const resultado = { ...base, ancho: imagen.width, alto: imagen.height, mini: await aJpeg(lienzo) };
    if ('close' in imagen) imagen.close();
    return resultado;
  } catch {
    // Un formato que este navegador no sabe leer: se sube el original igual, sin miniatura.
    return base;
  }
}

async function decodificar(archivo: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(archivo, { imageOrientation: 'from-image' });
  } catch {
    const url = URL.createObjectURL(archivo);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

function esperar(elemento: HTMLMediaElement, evento: string, ms: number): Promise<void> {
  return new Promise((ok, falla) => {
    const reloj = setTimeout(() => terminar(new Error(`sin ${evento}`)), ms);
    const alEvento = () => terminar();
    const alError = () => terminar(new Error('no se pudo leer'));
    function terminar(error?: Error) {
      clearTimeout(reloj);
      elemento.removeEventListener(evento, alEvento);
      elemento.removeEventListener('error', alError);
      if (error) falla(error);
      else ok();
    }
    elemento.addEventListener(evento, alEvento, { once: true });
    elemento.addEventListener('error', alError, { once: true });
  });
}

async function prepararVideo(archivo: File): Promise<Preparado> {
  const base: Preparado = { tipo: 'video', mini: null, ancho: null, alto: null, duracion: null, rechazo: null };
  const url = URL.createObjectURL(archivo);
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.src = url;

  try {
    await esperar(video, 'loadedmetadata', 10000);
    const dura = video.duration;
    if (Number.isFinite(dura) && dura > 0) {
      base.duracion = dura;
      if (dura > DURACION_MAXIMA + 0.5) {
        return { ...base, rechazo: `Dura ${formatoDuracion(dura)}; el máximo es 1 minuto` };
      }
    } else if (archivo.size > TAMANO_MAXIMO_VIDEO) {
      return { ...base, rechazo: 'Es muy pesado; el máximo es un video de 1 minuto' };
    }
    base.ancho = video.videoWidth || null;
    base.alto = video.videoHeight || null;

    // Portada: el cuadro del segundo 1 (o la mitad, si el video es más corto).
    try {
      if (video.readyState < 2) await esperar(video, 'loadeddata', 6000);
      video.currentTime = Math.min(1, (base.duracion ?? 2) / 2);
      await esperar(video, 'seeked', 6000);
      if (video.videoWidth) {
        const lienzo = lienzoMini(video.videoWidth, video.videoHeight);
        lienzo.getContext('2d')!.drawImage(video, 0, 0, lienzo.width, lienzo.height);
        base.mini = await aJpeg(lienzo);
      }
    } catch {
      // Códec que el navegador no reproduce: queda el ícono de video, sin portada.
    }
    return base;
  } catch {
    if (archivo.size > TAMANO_MAXIMO_VIDEO) {
      return { ...base, rechazo: 'Es muy pesado; el máximo es un video de 1 minuto' };
    }
    return base;
  } finally {
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(url);
  }
}
