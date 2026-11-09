# QR de fotos — 30 Aniversario Javier & Patricia

Página móvil para que los invitados suban fotos y videos (en calidad original) a Cloudflare R2
y vean una galería compartida. Llegan desde un QR por mesa: `https://.../?mesa=5`.

**Estado:** el frontend está terminado y funciona contra un backend **simulado**
(`dev/r2-simulado.ts`). Falta el backend real: un Worker de Cloudflare + R2 que cumpla el
mismo contrato descrito abajo.

## Correr el frontend

```bash
npm install
npm run dev          # http://localhost:5173/?mesa=5
npm run check        # tipos (svelte-check + tsc)
npm run build        # genera dist/ (estático)
```

- Pantallas por hash: `#inicio`, `#subiendo`, `#listo`, `#galeria`, `#foto/<id>`.
- El simulador guarda lo subido en `.r2-simulado/` (ignorado por git).
- Para probar mala señal: `QR_FALLOS=0.3 QR_LENTO=400 npm run dev`
  (30 % de subidas fallan con 500; cada petición a R2 tarda 400 ms).
- Para verlo en el celular: `npm run dev -- --host` y abrir la IP "Network" en el mismo wifi.

Stack: Vite + Svelte 5 + TypeScript, Uppy 6 (`@uppy/aws-s3` con `signRequest`, sin Dashboard).

## Contrato con el backend

La fuente de verdad es **`src/lib/api.ts`** (tipos) y **`dev/r2-simulado.ts`** (implementación
de referencia que ya funciona). El Worker debe responder las mismas rutas en el mismo dominio
que sirve el frontend (`dist/` como static assets).

### Claves de R2

Todas las claves deben cumplir:

```
^(mesa-\d{2}|sin-mesa)\/(original|mini)\/[0-9a-f-]{36}\.[a-z0-9]{2,5}$
```

Ejemplo: `mesa-05/original/3f1c...-....jpg` y su miniatura `mesa-05/mini/<otro-uuid>.jpg`
(JPEG de 400 px hecho en el celular). Rechazar con 400 cualquier otra clave.

### `POST /api/firmar`

Uppy pide una URL firmada por cada operación S3 (PUT simple, iniciar multipart, subir parte,
listar partes, completar, abortar). Cuerpo: el `PresignableRequest` de Uppy
(`{ method, key, uploadId?, partNumber?, ... }`).

Respuesta: `{ "url": "https://<cuenta>.r2.cloudflarestorage.com/<bucket>/<clave>?X-Amz-..." }`

- La URL debe ser **absoluta** (Uppy hace `new URL(url)`).
- Firmar con las llaves S3 de R2 (por ejemplo con `aws4fetch`). Las llaves van **solo** en
  `wrangler secret`, nunca en el código.
- El bucket necesita **CORS** para el dominio del sitio: métodos `PUT, POST, GET, DELETE, HEAD`,
  cabeceras permitidas `*` y **`ExposeHeaders: ["ETag"]`** (sin ETag fallan las subidas por partes).

### `POST /api/fotos`

Registra una foto después de subir el original (y la miniatura). Cuerpo (`NuevaFoto`):

```json
{ "id": "uuid", "tipo": "foto|video", "clave": "...", "claveMini": "...|null",
  "mesa": 5, "autor": "Ana|null", "ancho": 4032, "alto": 3024, "duracion": null }
```

- 400 si alguna clave no cumple el patrón; 409 si el original no existe en R2.
- **Idempotente por `id`**: si ya existe, devolver la misma foto con 200 (el celular reintenta).
- Respuesta 201: la `Foto` pública (ver abajo). `hora` la pone el servidor (ISO 8601).
- `autor` recortado a 60 caracteres.

### `GET /api/galeria?desde=<iso>`

```json
{ "fotos": [Foto, ...], "ahora": "2026-11-09T20:00:00.000Z" }
```

- Más recientes primero. Con `desde`, solo las que tengan `hora > desde`.
- `ahora` es la hora del servidor; el frontend la manda como `desde` en la siguiente consulta
  (consulta cada 20–30 s).

### Forma de `Foto`

```json
{ "id": "uuid", "tipo": "foto", "mini": "/url-miniatura|null", "url": "/url-para-ver",
  "descarga": "/url-que-descarga", "mesa": 5, "autor": "Ana", "hora": "ISO",
  "ancho": 4032, "alto": 3024, "duracion": null }
```

- `url` y `mini`: se usan en `<img>`/`<video>`. Para videos hay que soportar **`Range`**
  (Safari no los reproduce sin 206).
- `descarga`: debe responder con `Content-Disposition: attachment` (el simulador usa
  `javier-y-patricia-<archivo>`). Hoy descarga el original; pendiente confirmar si debe ser
  una versión más liviana.

## Pendiente

- Worker de Cloudflare + R2 (lo de arriba) y reemplazar `dev/r2-simulado.ts` en `vite.config.ts`
  por `@cloudflare/vite-plugin`.
- Panel privado (contraseña, ocultar, borrar): sin diseñar todavía.

## Diseño

`DESIGN.md`, `PRODUCT.md` y `CLAUDE.md` describen la dirección visual y las reglas del producto.
Nota: `DESIGN.md` todavía menciona Montserrat; las fuentes reales son Jost, Cormorant Garamond,
Bodoni Moda y Pinyon Script (ver `src/styles/tokens.css`).
