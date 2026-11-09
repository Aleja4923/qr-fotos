// Mesa (del QR) y nombre del invitado, guardados en el celular para la próxima visita.

const CLAVE_MESA = 'qr-fotos:mesa';
const CLAVE_NOMBRE = 'qr-fotos:nombre';

function leer(clave: string): string | null {
  try {
    return localStorage.getItem(clave);
  } catch {
    return null;
  }
}

function guardar(clave: string, valor: string | null) {
  try {
    if (valor) localStorage.setItem(clave, valor);
    else localStorage.removeItem(clave);
  } catch {
    // Navegación privada o almacenamiento bloqueado: se usa solo en esta visita.
  }
}

function mesaValida(texto: string | null): number | null {
  if (!texto || !/^\d{1,2}$/.test(texto.trim())) return null;
  const n = Number(texto);
  return n >= 1 && n <= 99 ? n : null;
}

function leerMesa(): number | null {
  const delQr = mesaValida(new URLSearchParams(location.search).get('mesa'));
  if (delQr !== null) {
    guardar(CLAVE_MESA, String(delQr));
    return delQr;
  }
  return mesaValida(leer(CLAVE_MESA));
}

class Invitado {
  readonly mesa = leerMesa();
  #nombre = $state(leer(CLAVE_NOMBRE) ?? '');

  get nombre() {
    return this.#nombre;
  }

  set nombre(valor: string) {
    this.#nombre = valor.slice(0, 60);
    guardar(CLAVE_NOMBRE, this.#nombre.trim() || null);
  }

  /** Nombre limpio para guardar con la foto, o null si no lo escribió. */
  get autor(): string | null {
    return this.#nombre.trim().replace(/\s+/g, ' ') || null;
  }

  get primerNombre(): string | null {
    return this.autor?.split(' ')[0] ?? null;
  }
}

export const invitado = new Invitado();
