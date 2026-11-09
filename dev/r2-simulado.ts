// R2 y API simulados para `npm run dev`. Responden las mismas rutas que tendrá el Worker
// (/api/firmar, /api/fotos, /api/galeria) y hablan el protocolo S3 mínimo que usa Uppy
// (PUT, subida por partes, listar, completar, cancelar). Guardan todo en .r2-simulado/.
// Se reemplaza por el Worker real con @cloudflare/vite-plugin.
//
// Variables útiles para probar con mala señal:
//   QR_FALLOS=0.3   → el 30 % de las subidas a R2 fallan con 500 (para ver los reintentos)
//   QR_LENTO=400    → cada petición a R2 espera 400 ms antes de responder
import { createHash, randomUUID } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, readdir, rm, stat, writeFile, appendFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';

const CLAVE = /^(mesa-\d{2}|sin-mesa)\/(original|mini)\/[0-9a-f-]{36}\.[a-z0-9]{2,5}$/;
const TIPOS: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  heic: 'image/heic', heif: 'image/heif', avif: 'image/avif',
  mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', '3gp': 'video/3gpp',
};

interface FotoGuardada {
  id: string;
  tipo: 'foto' | 'video';
  clave: string;
  claveMini: string | null;
  mesa: number | null;
  autor: string | null;
  hora: string;
  ancho: number | null;
  alto: number | null;
  duracion: number | null;
}

export function r2Simulado(): Plugin {
  const raiz = join(process.cwd(), '.r2-simulado');
  const objetos = join(raiz, 'objetos');
  const partes = join(raiz, 'partes');
  const indice = join(raiz, 'fotos.json');
  const fallos = Number(process.env.QR_FALLOS ?? 0);
  const lento = Number(process.env.QR_LENTO ?? 0);

  async function leerFotos(): Promise<FotoGuardada[]> {
    try {
      return JSON.parse(await readFile(indice, 'utf8'));
    } catch {
      return [];
    }
  }

  function publica(f: FotoGuardada) {
    return {
      id: f.id,
      tipo: f.tipo,
      mini: f.claveMini ? `/s3/${f.claveMini}` : null,
      url: `/s3/${f.clave}`,
      descarga: `/s3/${f.clave}?descargar=1`,
      mesa: f.mesa,
      autor: f.autor,
      hora: f.hora,
      ancho: f.ancho,
      alto: f.alto,
      duracion: f.duracion,
    };
  }

  function json(res: ServerResponse, estado: number, cuerpo: unknown) {
    res.statusCode = estado;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cuerpo));
  }

  function xml(res: ServerResponse, cuerpo: string) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/xml');
    res.end(`<?xml version="1.0" encoding="UTF-8"?>${cuerpo}`);
  }

  async function leerCuerpo(req: IncomingMessage): Promise<string> {
    const trozos: Buffer[] = [];
    for await (const t of req) trozos.push(t as Buffer);
    return Buffer.concat(trozos).toString('utf8');
  }

  /** Guarda el cuerpo en un archivo y devuelve el ETag (MD5), como S3. */
  async function guardarCuerpo(req: IncomingMessage, destino: string): Promise<string> {
    await mkdir(dirname(destino), { recursive: true });
    const md5 = createHash('md5');
    const salida = createWriteStream(destino);
    for await (const t of req) {
      md5.update(t as Buffer);
      if (!salida.write(t)) await new Promise<void>((ok) => salida.once('drain', () => ok()));
    }
    await new Promise<void>((ok, falla) => salida.end((e?: Error | null) => (e ? falla(e) : ok())));
    return `"${md5.digest('hex')}"`;
  }

  async function api(req: IncomingMessage, res: ServerResponse, url: URL) {
    if (url.pathname === '/api/firmar' && req.method === 'POST') {
      const p = JSON.parse(await leerCuerpo(req));
      if (typeof p.key !== 'string' || !CLAVE.test(p.key)) return json(res, 400, { error: 'clave inválida' });
      const base = `/s3/${p.key}`;
      const q = new URLSearchParams();
      if (p.method === 'POST' && !p.uploadId) q.set('uploads', '');
      if (p.uploadId) q.set('uploadId', p.uploadId);
      if (p.partNumber) q.set('partNumber', String(p.partNumber));
      q.set('X-Amz-Signature', 'simulada');
      // Absoluta, como las de R2: Uppy arma un URL con ella.
      return json(res, 200, { url: `http://${req.headers.host}${base}?${q}` });
    }

    if (url.pathname === '/api/fotos' && req.method === 'POST') {
      const p = JSON.parse(await leerCuerpo(req));
      if (!CLAVE.test(p.clave ?? '') || (p.claveMini !== null && !CLAVE.test(p.claveMini ?? ''))) {
        return json(res, 400, { error: 'clave inválida' });
      }
      try {
        await stat(join(objetos, p.clave));
      } catch {
        return json(res, 409, { error: 'el original no está en R2' });
      }
      const fotos = await leerFotos();
      const existente = fotos.find((f) => f.id === p.id);
      if (existente) return json(res, 200, publica(existente));
      const nueva: FotoGuardada = {
        id: p.id,
        tipo: p.tipo === 'video' ? 'video' : 'foto',
        clave: p.clave,
        claveMini: p.claveMini,
        mesa: Number.isInteger(p.mesa) ? p.mesa : null,
        autor: typeof p.autor === 'string' ? p.autor.slice(0, 60) : null,
        hora: new Date().toISOString(),
        ancho: p.ancho ?? null,
        alto: p.alto ?? null,
        duracion: p.duracion ?? null,
      };
      fotos.push(nueva);
      await mkdir(raiz, { recursive: true });
      await writeFile(indice, JSON.stringify(fotos, null, 1));
      return json(res, 201, publica(nueva));
    }

    if (url.pathname === '/api/galeria' && req.method === 'GET') {
      const desde = url.searchParams.get('desde');
      const ahora = new Date().toISOString();
      const fotos = (await leerFotos())
        .filter((f) => !desde || f.hora > desde)
        .sort((a, b) => b.hora.localeCompare(a.hora))
        .map(publica);
      return json(res, 200, { fotos, ahora });
    }

    json(res, 404, { error: 'no existe' });
  }

  async function s3(req: IncomingMessage, res: ServerResponse, url: URL) {
    const clave = decodeURIComponent(url.pathname.slice('/s3/'.length));
    if (!CLAVE.test(clave)) return json(res, 400, { error: 'clave inválida' });
    const q = url.searchParams;
    const uploadId = q.get('uploadId');
    const archivo = join(objetos, clave);

    if (lento) await new Promise((ok) => setTimeout(ok, lento));

    if (req.method === 'PUT') {
      if (fallos && Math.random() < fallos) {
        req.resume();
        res.statusCode = 500;
        return res.end('fallo simulado');
      }
      const destino = uploadId ? join(partes, uploadId, q.get('partNumber') ?? '0') : archivo;
      const etag = await guardarCuerpo(req, destino);
      res.setHeader('ETag', etag);
      res.statusCode = 200;
      return res.end();
    }

    if (req.method === 'POST' && q.has('uploads')) {
      const id = randomUUID();
      await mkdir(join(partes, id), { recursive: true });
      return xml(res, `<InitiateMultipartUploadResult><Key>${clave}</Key><UploadId>${id}</UploadId></InitiateMultipartUploadResult>`);
    }

    if (req.method === 'GET' && uploadId) {
      let lista = '';
      try {
        for (const n of (await readdir(join(partes, uploadId))).sort((a, b) => Number(a) - Number(b))) {
          const md5 = createHash('md5').update(await readFile(join(partes, uploadId, n))).digest('hex');
          lista += `<Part><PartNumber>${n}</PartNumber><ETag>"${md5}"</ETag></Part>`;
        }
      } catch {
        // Sin partes todavía.
      }
      return xml(res, `<ListPartsResult><Key>${clave}</Key><UploadId>${uploadId}</UploadId>${lista}</ListPartsResult>`);
    }

    if (req.method === 'POST' && uploadId) {
      const cuerpo = await leerCuerpo(req);
      const numeros = [...cuerpo.matchAll(/<PartNumber>(\d+)<\/PartNumber>/g)].map((m) => m[1]);
      await mkdir(dirname(archivo), { recursive: true });
      await writeFile(archivo, '');
      for (const n of numeros) await appendFile(archivo, await readFile(join(partes, uploadId, n)));
      await rm(join(partes, uploadId), { recursive: true, force: true });
      return xml(res, `<CompleteMultipartUploadResult><Location>/s3/${clave}</Location><Key>${clave}</Key></CompleteMultipartUploadResult>`);
    }

    if (req.method === 'DELETE') {
      await rm(uploadId ? join(partes, uploadId) : archivo, { recursive: true, force: true });
      res.statusCode = 204;
      return res.end();
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      let tam: number;
      try {
        tam = (await stat(archivo)).size;
      } catch {
        res.statusCode = 404;
        return res.end();
      }
      const ext = clave.split('.').pop() ?? '';
      res.setHeader('Content-Type', TIPOS[ext] ?? 'application/octet-stream');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      if (q.has('descargar')) res.setHeader('Content-Disposition', `attachment; filename="javier-y-patricia-${clave.split('/').pop()}"`);

      // Safari pide los videos por rangos; sin esto no los reproduce.
      const rango = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
      let inicio = 0;
      let fin = tam - 1;
      if (rango) {
        inicio = rango[1] ? Number(rango[1]) : Math.max(0, tam - Number(rango[2]));
        fin = rango[1] && rango[2] ? Math.min(Number(rango[2]), tam - 1) : tam - 1;
        res.statusCode = 206;
        res.setHeader('Content-Range', `bytes ${inicio}-${fin}/${tam}`);
      } else {
        res.statusCode = 200;
      }
      res.setHeader('Content-Length', String(fin - inicio + 1));
      if (req.method === 'HEAD') return res.end();
      return createReadStream(archivo, { start: inicio, end: fin }).pipe(res);
    }

    res.statusCode = 405;
    res.end();
  }

  return {
    name: 'r2-simulado',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, siguiente) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const manejar = url.pathname.startsWith('/api/') ? api : url.pathname.startsWith('/s3/') ? s3 : null;
        if (!manejar) return siguiente();
        manejar(req, res, url).catch((e: unknown) => {
          server.config.logger.error(`[r2-simulado] ${String(e)}`);
          if (!res.headersSent) json(res, 500, { error: 'error interno' });
          else res.end();
        });
      });
    },
  };
}
