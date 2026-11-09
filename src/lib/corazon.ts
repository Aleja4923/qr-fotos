// Posiciones de las perlas del corazón, como el corazón de perlas de la invitación.
// Curva clásica del corazón, muestreada por longitud de arco para que las perlas queden parejas.

export interface PerlaCorazon {
  x: number;
  y: number;
  r: number;
}

function punto(t: number) {
  const s = Math.sin(t);
  return {
    x: 16 * s * s * s,
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
  };
}

/** Variación pseudoaleatoria estable (la misma en cada carga). */
function variacion(i: number) {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

/** Devuelve `n` perlas empezando en la punta de abajo, en el orden en que se encienden. */
export function perlasCorazon(n: number): PerlaCorazon[] {
  const muestras = 1600;
  const puntos = [];
  const acumulado = [0];
  for (let k = 0; k <= muestras; k++) {
    puntos.push(punto(Math.PI + (2 * Math.PI * k) / muestras));
    if (k > 0) {
      const a = puntos[k - 1];
      const b = puntos[k];
      acumulado.push(acumulado[k - 1] + Math.hypot(b.x - a.x, b.y - a.y));
    }
  }
  const total = acumulado[muestras];
  const espacio = total / n;

  const enLinea: PerlaCorazon[] = [];
  let k = 0;
  for (let i = 0; i < n; i++) {
    const objetivo = espacio * i;
    while (acumulado[k + 1] < objetivo) k++;
    const p = puntos[k];
    enLinea.push({ x: p.x, y: p.y, r: espacio * 0.5 * (0.8 + 0.22 * variacion(i)) });
  }

  // Se encienden desde la punta, subiendo por los dos lados a la vez.
  const orden: PerlaCorazon[] = [];
  for (let a = 0, b = n - 1; a <= b; a++, b--) {
    orden.push(enLinea[a]);
    if (a !== b) orden.push(enLinea[b]);
  }
  return orden;
}

/** Perlas que caben en el corazón. Con más fotos, el corazón queda lleno y el número sigue subiendo. */
export const PERLAS_DEL_CORAZON = 60;
