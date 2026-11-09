// Rutas por hash (#inicio, #galeria…): cada pantalla tiene su propia URL sin servidor.

export const rutas = ['inicio', 'subiendo', 'listo', 'galeria', 'foto'] as const;
export type Ruta = (typeof rutas)[number];

export function leerRuta(): Ruta {
  const hash = location.hash.slice(1);
  return (rutas as readonly string[]).includes(hash) ? (hash as Ruta) : 'inicio';
}
