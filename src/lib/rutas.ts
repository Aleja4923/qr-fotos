// Rutas por hash (#inicio, #galeria, #foto/<id>…): cada pantalla tiene su propia URL sin servidor.
// La consulta (?mesa=5) queda intacta al cambiar de pantalla.

export const pantallas = ['inicio', 'subiendo', 'listo', 'galeria', 'foto'] as const;
export type Pantalla = (typeof pantallas)[number];

export interface Ruta {
  pantalla: Pantalla;
  /** Id de la foto en #foto/<id>. */
  id: string | null;
}

export function leerRuta(): Ruta {
  const [nombre, id] = location.hash.slice(1).split('/');
  const pantalla = (pantallas as readonly string[]).includes(nombre) ? (nombre as Pantalla) : 'inicio';
  return { pantalla, id: pantalla === 'foto' && id ? decodeURIComponent(id) : null };
}

export function irA(hash: string) {
  location.hash = hash;
}

/** Cambia de pantalla sin dejar la anterior en el historial (pasar fotos en el visor). */
export function reemplazar(hash: string) {
  location.replace(hash);
}
