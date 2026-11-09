# QR de fotos — Aniversario 30 Patty y Javier

Página móvil para que los invitados suban fotos y videos a R2 y vean una galería compartida.
Stack: Vite + Svelte 5 + TypeScript, Uppy (@uppy/aws-s3, sin Dashboard), PhotoSwipe 5,
Worker de Cloudflare con static assets, R2. Detalle en docs/frontend-opcion-b.md.

## Diseño
- Antes de cualquier pantalla, lee @DESIGN.md y usa solo sus tokens (src/styles/tokens.css).
- Si cambias DESIGN.md, corre: npx -p @google/design.md designmd lint DESIGN.md
- La referencia visual es la invitación impresa (foto en docs/). Lee también @PRODUCT.md y la
  dirección en .impeccable/surfaces/src-app-svelte.md. El Figma anterior quedó descartado como
  dirección visual; solo sirve como inventario de contenido.
- Lo nuevo (panel, errores, galería vacía) se diseña con /impeccable dentro del mundo de la
  invitación, respetando DESIGN.md.

## Svelte
- Consulta la documentación con el MCP de Svelte antes de escribir componentes.
- Pasa svelte-autofixer por cada .svelte que crees o edites hasta que no queden avisos.

## Cloudflare
- Para el Worker, R2, CORS y wrangler, usa las skills y el MCP de docs de Cloudflare.

## Verificar
- Después de cada pantalla: abre la página con Playwright en 375 px y 412 px, toma
  captura, compárala con la del Figma y corrige antes de seguir.
- Revisa también la consola con Playwright (browser_console_messages) y corrige los errores.
- Subiendo y Galería: pruébalas con Chrome DevTools MCP en red "Slow 4G" y "Slow 3G"
  con CPU 4x más lenta; revisa reintentos, progreso y que la galería no se trabe.
- Al terminar todas: /design-review, /impeccable audit y review-animations.

## Reglas de subida
- input: accept="image/*,video/*" y multiple. Nunca image/heic ni el atributo capture.
- Videos de máximo 60 s; miniatura JPEG de 400 px hecha en el navegador.
- Las llaves de R2 solo en wrangler secret, nunca en el código.
