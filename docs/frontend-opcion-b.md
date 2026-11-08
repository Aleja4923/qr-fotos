# Frontend opción B — QR de fotos

Nov 8, 2026 · @aleja

## Resumen

Recomendamos **Vite + Svelte 5 + Uppy (plugin S3) + PhotoSwipe**, todo en un solo proyecto de **Cloudflare Workers con static assets** (no Pages), y construir las pantallas desde el Figma con el MCP de Figma y verificarlas con Playwright.

| Pieza | Elección | Por qué |
| --- | --- | --- |
| Base | Vite + Svelte 5 + TypeScript | 3 pantallas y una cola de subidas con mucho estado; Svelte lo maneja con poco código y poco JavaScript para el celular |
| Subidas | Uppy `@uppy/aws-s3` con `signRequest`, sin su interfaz | Subida directa a R2, por partes para videos, reintenta solo la parte que falla; la interfaz es la del Figma |
| Firma en el Worker | `aws4fetch` | La librería que Cloudflare documenta para firmar URLs de R2 dentro de un Worker |
| Galería | Cuadrícula CSS + `loading="lazy"` + PhotoSwipe 5 | Deslizar, zoom con dos dedos y contador "3 de 248" ya resueltos |
| Despliegue | Workers static assets + `@cloudflare/vite-plugin` | Lo que Cloudflare recomienda hoy para proyectos nuevos; página y API en un solo despliegue |
| Del diseño al código | Plugins de Figma, Svelte, Cloudflare y Playwright + skills Impeccable y Emil Kowalski | El diseño ya existe: hay que copiarlo fiel, revisarlo en tamaño de celular y pulirlo (ver el kit, abajo) |

Esto cambia un detalle del análisis técnico: ahí dice "Cloudflare Pages", y para un proyecto nuevo conviene Workers con static assets. El costo es el mismo (gratis).

## Kit de Claude para este proyecto: plugins, skills y MCPs

Para construir este frontend en Claude Code, el kit son 9 piezas, cada una con un momento del trabajo. La columna Origen dice de dónde salió: 6 vienen de nuestra investigación (Figma, Svelte, Cloudflare, Chrome DevTools, el agente de revisión de diseño y el formato DESIGN.md), 1 de los reels (Playwright) y 2 de tu lista (Impeccable y Emil Kowalski).

| Herramienta | Origen | Tipo | Qué hace en este proyecto | Cuándo se usa | Cómo se instala (en Claude Code) |
| --- | --- | --- | --- | --- | --- |
| [Figma](https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server) (oficial) | Investigación | Plugin con MCP | Lee las 6 pantallas, los 12 colores y los componentes del demo de perlas | Al pasar cada pantalla a código | `/plugin install figma@claude-plugins-official` |
| [Svelte](https://svelte.dev/docs/ai/claude-plugin) (oficial) | Investigación | Plugin: MCP, skills y un agente | Documentación actual de Svelte 5 y `svelte-autofixer`, que revisa cada componente | Cada vez que se crea o edita un `.svelte` | `/plugin marketplace add sveltejs/ai-tools` y luego `/plugin install svelte` |
| [Cloudflare](https://developers.cloudflare.com/agent-setup/claude-code/) (oficial) | Investigación | Plugin: 8 skills y MCPs de docs, bindings y logs | Worker de firmas, R2, CORS, `wrangler` y despliegue; su skill `web-perf` mide la velocidad de carga | Al hacer la API, configurar R2 y desplegar | `/plugin marketplace add cloudflare/skills` y luego `/plugin install cloudflare@cloudflare` |
| [Chrome DevTools MCP](https://claudelog.com/claude-code-mcps/chrome-devtools-mcp) (Google) | Investigación | MCP | Simula red lenta (3G, 4G) y CPU de celular barato: prueba la cola de subidas, los reintentos y la galería con mala señal, y corre Lighthouse | Al terminar Subiendo y Galería | `claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest` |
| Agente de revisión de diseño ([OneRedOak](https://github.com/OneRedOak/claude-code-workflows)) | Investigación | Subagente + comando `/design-review` | Un revisor aparte que no escribió el código abre la página con Playwright y la compara contra DESIGN.md: responsive, accesibilidad y fidelidad | Antes de mostrarle la página a Patty | Copiar la carpeta `design-review` del repositorio a `.claude/agents/` y `.claude/commands/` del proyecto |
| [DESIGN.md](https://www.creativeainews.com/blog/google-design-md-open-source-ai-brand-design-stitch/) (formato abierto de Google) | Investigación | Formato + CLI | Guarda los tokens de perlas con la razón de cada decisión; Claude lo lee siempre y el CLI revisa que esté bien escrito | Al empezar, y cada vez que cambie un color o fuente | `npx @google/design.md lint DESIGN.md` |
| Playwright | Reels de @santiremedio | Plugin con MCP | Abre la página en 375 y 412 px, toma capturas y las compara con el Figma | Después de cada pantalla | `/plugin install playwright@claude-plugins-official` |
| [Impeccable](https://github.com/pbakaus/impeccable) | Tu lista | Skill de diseño | Con `critique`, `audit` y `polish` revisa fidelidad, contraste y detalles; diseña lo que no está en Figma (panel, errores, galería vacía) | Panel, estados y pasada final | `npx impeccable install` y luego `npx impeccable telemetry off` |
| [Emil Kowalski](https://github.com/emilkowalski/skills/tree/main/skills) | Tu lista | Skills de animación | Micro-animaciones: el check de "¡Gracias!", las barras de progreso, la entrada de fotos nuevas y la apertura del visor | Al final, cuando todo funciona | `npx skills add emilkowalski/skills --skill emil-design-eng` y `--skill review-animations` |

**Una sola skill de diseño.** Impeccable reemplaza al plugin `frontend-design`: no conviene tener las dos activas, porque se contradicen. Si Impeccable resulta pesado (gasta más tokens y tiempo), se cambia por `/plugin install frontend-design@claude-plugins-official`.

**Lo que no entra en este proyecto:**

| Herramienta | Por qué no |
| --- | --- |
| Taste Skill | Está hecha para inventar landings; aquí el diseño ya existe, y choca con Impeccable |
| Everything Claude Code | Cientos de skills generales; mete ruido sin aportar al diseño de perlas |
| shadcn MCP y 21st.dev | Sus componentes son para React y tienen su propio estilo; aquí los componentes salen del Figma |
| UI UX Pro Max | Es un catálogo para elegir un estilo, y el estilo ya está elegido |

**Orden para dejarlo listo** (una vez, en la carpeta del proyecto):

1. Crear el proyecto: `npm create vite@latest qr-fotos -- --template svelte-ts`, entrar a la carpeta y abrir `claude`.
2. Instalar todo lo de la tabla con sus comandos: los `/plugin` dentro de Claude Code y los `npx` y `claude mcp add` en la terminal.
3. Revisar que estén conectados con `/mcp` (deben aparecer figma, svelte, playwright, chrome-devtools y los de cloudflare) y `/plugin` para ver los instalados.
4. Crear `DESIGN.md` desde el Figma y copiar el `CLAUDE.md` en la raíz.
5. Ir pantalla por pantalla: Inicio, Subiendo, Listo, Galería, Foto abierta y, al final, Panel.

**Límites a tener en cuenta:** el MCP de Figma tiene un tope bajo de llamadas al mes en los planes Starter; el archivo está en el equipo del plan estudiante, así que hay que conectar Figma con esa cuenta. Este kit funciona en Claude Code (terminal o app de escritorio); en el chat de claude.ai solo está Figma y no hay Playwright.

## Qué tiene que hacer el frontend

Son 3 páginas cortas para el invitado (subir, galería, foto abierta) y 1 panel privado; lo difícil no es el diseño sino que la subida aguante en un celular con mala señal.

El [demo en Figma](https://www.figma.com/design/IMdVYCWxYC2X4Ogs1gQyvS?node-id=4-422) tiene 6 pantallas: inicio, subiendo, listo, galería, foto abierta y sticker de mesa. El sticker es un impreso y no va en la página.

| Pantalla | Lo que pide al código |
| --- | --- |
| Inicio | Leer `?mesa=5` del QR, nombre opcional guardado en el celular, botón que abre cámara o galería |
| Subiendo | Cola de archivos con progreso por archivo, reintentos y aviso de no cerrar la página |
| Listo | Contador de lo subido y botones para seguir |
| Galería | Cuadrícula de miniaturas con filtro por mesa, etiqueta de video y botón flotante; se actualiza cada 20 a 30 s |
| Foto abierta | Visor a pantalla completa con deslizar, "3 de 248", autor, mesa, hora y descarga del original |
| Panel (no está en Figma) | Contraseña, ocultar y borrar |

**Tokens ya definidos en Figma** (colección "Perlas"), que pasan tal cual a variables CSS:

| Token | Color |
| --- | --- |
| fondo | #faf7f2 |
| crema | #f1e9dc |
| superficie / blanco | #ffffff |
| borde | #e7dfd3 |
| borde-dorado | #e2d4bd |
| dorado | #a88a5a |
| dorado-oscuro | #6e5634 |
| texto | #2f2a26 |
| texto-suave | #7a716a |
| verde | #7e9c6e |
| oscuro | #1e1b18 |

Tipografía: Cormorant Garamond para títulos y Montserrat para texto. El diseño ya es distintivo (perlas, serif, dorado sobre crema), así que el trabajo es implementarlo fiel, no reinventarlo.

## Framework y estructura

Svelte 5 sobre Vite es el punto medio: menos código que JavaScript puro para la cola de subidas, y mucho menos peso que React o Next.js para un invitado con datos móviles.

| Opción | Veredicto | Razón |
| --- | --- | --- |
| **Svelte 5 + Vite** | Recomendada | Estado reactivo simple para la cola; Uppy trae hooks y componentes sin estilo para Svelte 5 ([Uppy Svelte](https://uppy.io/docs/svelte/)) |
| JavaScript puro + Vite | Buena alternativa | Lo más liviano, pero la cola (progreso, reintentos, estados) se vuelve código manual difícil de mantener |
| React + Vite | Funciona | Más ejemplos en internet, pero más JavaScript que descargar para 3 pantallas |
| Astro | Innecesario | Brilla en sitios de contenido; aquí todo es interacción en el navegador |
| Next.js | Descartado | Servidor y complejidad que este proyecto no necesita |

**Estructura sugerida** (un solo repositorio, un solo despliegue):

```
qr-fotos/
  src/                 # la página (Svelte)
    routes: subir, galeria, panel
    lib/subidas.ts     # Uppy + reglas (1 min, tipos, mesa)
    lib/miniatura.ts   # miniatura JPEG de 400 px
    styles/tokens.css  # los 12 colores del Figma
  worker/index.ts      # /api/firmar, /api/galeria, /api/panel
  wrangler.jsonc
  DESIGN.md            # tokens, fuentes y reglas del diseño de perlas
  docs/frontend-opcion-b.md
```

Como son pocas pantallas, no hace falta SvelteKit: basta un enrutador mínimo o tres archivos HTML de entrada en Vite. Las fuentes (Cormorant Garamond y Montserrat) conviene servirlas desde el mismo dominio con Fontsource, solo con los pesos que usa el diseño, en vez de cargarlas desde Google Fonts.

## Subidas a R2

Usar Uppy 6 sin su interfaz: maneja la cola, el progreso, las subidas por partes y los reintentos, y ustedes pintan la pantalla "Subiendo" del Figma con su estado.

**Cómo encaja con el Worker.** Con la opción `signRequest`, Uppy le pide al Worker una URL firmada para cada operación y el archivo va directo a R2; las credenciales nunca salen del servidor ([Uppy AWS S3](https://uppy.io/docs/aws-s3/)). Para videos, el Worker tiene que firmar 6 operaciones: subir, crear subida por partes, subir parte, listar partes, completar y cancelar. En el Worker se firma con `aws4fetch`, que es la que Cloudflare documenta para R2 ([aws4fetch en R2](https://developers.cloudflare.com/r2/examples/aws/aws4fetch)).

**Ajustes que cambian respecto a los valores por defecto:**

| Opción de Uppy | Por defecto | Para este evento | Por qué |
| --- | --- | --- | --- |
| `shouldUseMultipart` | Archivos de más de 100 MiB | Videos de más de ~20 MB | Un video de 1 minuto pesa de 60 a 170 MB; por partes, un corte de señal solo repite la parte que falló |
| `limit` (subidas a la vez) | 6 | 2 o 3 | Con la antena del salón llena, 6 subidas a la vez se estorban entre sí |
| `generateObjectKey` | UUID + nombre | `mesa-05/original/<uuid>.jpg` | Mantiene la carpeta por mesa del análisis técnico |

**CORS del bucket.** Debe exponer el encabezado `ETag`; sin él, las subidas por partes no se pueden completar. Las URLs firmadas solo funcionan con el dominio `<cuenta>.r2.cloudflarestorage.com`, no con el dominio propio que sirve las miniaturas.

**Que la subida no se corte.**

- **Pantalla encendida:** pedir `navigator.wakeLock.request('screen')` mientras haya subidas. Safari de iPhone lo soporta desde iOS 16.4 ([caniuse](https://caniuse.com/wake-lock)); se pierde si el invitado cambia de app, así que hay que volver a pedirlo al regresar a la página.
- **Si cierra la pestaña:** el plugin Golden Retriever de Uppy guarda en el celular las fotos de hasta 10 MiB y la cola, y las retoma al volver a abrir la página ([Golden Retriever](https://uppy.io/docs/golden-retriever/)). Los videos solo se recuperan con un service worker, y eso no sobrevive si se reinicia el navegador. Es opcional: vale la pena probarlo con la familia antes de dejarlo.
- **Aviso visible:** el texto "No cierres esta página" del Figma ya cubre lo que la técnica no puede.

## Fotos de iPhone, miniaturas y videos

El problema de HEIC es menor de lo que dice el análisis técnico: en iPhone, las fotos elegidas desde un `<input type="file">` llegan normalmente convertidas a JPEG, así que la miniatura se puede hacer en cualquier navegador.

**Lo que pasa en iPhone.** Safari de iPhone convierte a JPEG la foto HEIC que se elige desde la página, sin importar el atributo `accept` ([prueba de zenn.dev](https://zenn.dev/link/comments/c356d4558e16ad), 2025). En 2024 WebKit probó entregar el HEIC original con `accept="image/*"`, pero luego restauró la conversión ([commit de WebKit](https://github.com/WebKit/WebKit/commit/5b0e147c095567387a080a2da87c79f95ed04744)). Para los videos, WebKit sigue convirtiendo a H.264 por compatibilidad ([commit de WebKit](https://github.com/WebKit/WebKit/commit/02a5c284178e4c4c9184cf721954243d59678a03)). Hay que confirmarlo en los iPhone de la familia, porque depende de la versión de iOS.

**Reglas para el campo de archivos:**

- `accept="image/*,video/*"` y `multiple`. **No** agregar `image/heic`: desde Safari 17 eso hace que convierta los PNG y JPG a HEIC ([foro de Apple](https://developer.apple.com/forums/thread/743049)).
- **No** usar el atributo `capture`: obliga a abrir la cámara y quita la opción de elegir de la galería. Sin él, el iPhone ofrece "Fototeca", "Tomar foto" y "Elegir archivo", que es justo el botón "Tomar o subir fotos" del diseño.

**Miniatura (400 px) en el celular, antes de subir:**

1. Decodificar con `createImageBitmap` y dibujar en un canvas pequeño. El canvas de 400 px no choca con el límite de ~16,7 megapíxeles de Safari, que solo aplica a canvas grandes (como el del marco de perlas).
2. Exportar con `canvas.toBlob('image/jpeg', 0.8)`: queda de unos 30 a 60 KB y sin metadatos GPS.
3. Subirla aparte a `mesa-XX/mini/` y guardar ancho y alto de la foto, porque PhotoSwipe los necesita.
4. Si el decodificado falla (un HEIC raro desde Android o computador), subir el original igual y mostrar un ícono en la galería.

**Videos:**

- **Duración:** leer `video.duration` en `loadedmetadata` con un `<video>` oculto; si dura más de 60 s, avisar antes de subir. Si el navegador no puede leerlo (HEVC en algunos Android con Chrome), usar un tope de tamaño de unos 200 MB.
- **Portada:** dibujar en el canvas el cuadro del segundo 1. Si el códec no se puede reproducir, dejar el ícono de video con la duración, como en el diseño ("0:42").

## Galería y visor

La cuadrícula se hace con CSS y el visor con PhotoSwipe 5; para unas 250 a 1.000 miniaturas no hace falta una librería de listas virtuales.

- **Cuadrícula:** CSS Grid de 3 columnas como en el Figma, `<img loading="lazy" decoding="async">` con `width` y `height` puestos para que no salte al cargar. Filtro por mesa con los chips del diseño, sin recargar la página.
- **Actualización:** pedir al Worker solo lo nuevo (`/api/galeria?desde=<hora>`) cada 25 s, y pausar mientras la pestaña está oculta (`visibilitychange`) para no gastar datos ni batería.
- **Visor:** [PhotoSwipe 5](https://photoswipe.com) (versión 5.4.4 en npm) trae deslizar, zoom con dos dedos y el contador "3 de 248". Encima se agregan con su API los elementos del diseño: "Subida por Laura Gómez", mesa y hora, y los botones Anterior y Descargar.
- **Videos en el visor:** el [plugin de video de PhotoSwipe](https://github.com/dimsemenov/photoswipe-video-plugin) existe pero su autor lo marca como en desarrollo. Es más seguro que el visor muestre la portada con un botón de reproducir y abra un `<video playsinline controls>` propio.
- **Descargar el original:** desde la galería pública se descarga la miniatura o una versión mediana; el original solo desde el panel, como dice el análisis técnico por privacidad. Hay que decidir cuál de las dos cosas promete el botón "Descargar" del diseño.

## Del Figma al código con Claude

Como el diseño ya está hecho, la herramienta que más ayuda no es una skill de "estética" sino el MCP de Figma: le da a Claude el código de referencia, los tokens y una captura de cada pantalla, y Playwright cierra el ciclo mostrando cómo quedó.

1. **DESIGN.md primero.** Pasar los 12 colores de la colección "Perlas", las dos fuentes, los radios y el espaciado a `DESIGN.md` y a `tokens.css`. Agregar lo que no se debe hacer: nada de degradados morados, sombras grandes ni fuentes del sistema.
2. **Una pantalla a la vez con el MCP de Figma.** Claude Code con el plugin oficial de Figma usa `get_design_context` por pantalla, siguiendo la skill `figma-design-to-code`, que obliga a reutilizar los tokens y componentes del proyecto. Son unas 6 llamadas para todo el diseño.
3. **Componentes del Figma = componentes de Svelte.** Botón (primario y secundario), miniatura, fila de subida, collar de perlas e íconos ya existen en el Figma; se crean una vez y se reutilizan.
4. **Verificar con Playwright.** Después de cada pantalla, Claude abre la página en 375 px (iPhone) y 412 px (Android), toma una captura y la compara con el Figma. Ojo: no puede probar la cámara ni la fototeca reales.
5. **Pulido.** Impeccable diseña lo que no está en el Figma (estados de error, panel, galería vacía) respetando `DESIGN.md`, y al final `/impeccable audit` y `polish` revisan detalles y accesibilidad. Las skills de Emil Kowalski hacen la pasada de animaciones.
6. **Prueba real.** La prueba con la familia en sus propios celulares es la que valida las subidas, HEIC y la señal; ninguna herramienta la reemplaza.

**Lo que falta diseñar en Figma antes de programar:** el panel de administración, los estados de error ("no se pudo subir", "video muy largo") y la galería vacía.

## Despliegue en Cloudflare

Un solo Worker con static assets sirve la página y responde la API; Cloudflare lo recomienda para proyectos nuevos, y Pages sigue funcionando, pero las funciones nuevas llegan a Workers ([Flavio Copes](https://flaviocopes.com/cloudflare-pages-vs-workers/)).

- **Desarrollo local:** `@cloudflare/vite-plugin` corre la página y el Worker juntos con `npm run dev`, con las mismas reglas que en producción ([tutorial de Cloudflare](https://developers.cloudflare.com/workers/vite-plugin/tutorial)).
- **Rutas:** en `wrangler.jsonc`, `"run_worker_first": ["/api/*"]` para que la API nunca devuelva el HTML de la página por error.
- **Costo:** los archivos estáticos se sirven gratis y sin límite; solo las llamadas a `/api/*` cuentan dentro de las 100.000 diarias del plan gratis, con 10 ms de CPU por llamada. Firmar una URL cabe de sobra en ese tiempo.
- **Secretos:** las llaves de R2 van con `wrangler secret put` (y en `.dev.vars` para desarrollo, fuera de git), nunca en el código ni en el repositorio.
- **Dominio:** el dominio propio (USD 10 a 12 al año) apunta al Worker para la página y a R2 para las miniaturas.

## Lo que descartamos

| Opción | Por qué no |
| --- | --- |
| Interfaz Dashboard de Uppy | Se ve como Uppy, no como el diseño de perlas; se usa solo su lógica |
| Subir el archivo a través del Worker | El plan gratis acepta hasta 100 MB por petición y 10 ms de CPU; no sirve para videos |
| Convertir HEIC con librerías WASM (heic2any, libheif) | El iPhone ya entrega JPEG; agregaría cientos de KB para un caso raro |
| Comprimir videos en el celular | Lento y gasta batería; el límite de 1 minuto resuelve el peso |
| Websockets para la galería en vivo | Consultar cada 25 s basta para una fiesta |
| App instalable (PWA) | Nadie va a instalar nada; además, en iPhone la pantalla encendida (wake lock) falló por años en apps de pantalla de inicio |

## Fuentes

- [Demo en Figma: QR de fotos, Aniversario 30](https://www.figma.com/design/IMdVYCWxYC2X4Ogs1gQyvS?node-id=4-422)
- [Uppy: plugin AWS S3 (v6)](https://uppy.io/docs/aws-s3/)
- [Uppy: integración con Svelte](https://uppy.io/docs/svelte/)
- [Uppy: Golden Retriever](https://uppy.io/docs/golden-retriever/)
- [Cloudflare R2: firmar con aws4fetch](https://developers.cloudflare.com/r2/examples/aws/aws4fetch)
- [Cloudflare: tutorial del plugin de Vite](https://developers.cloudflare.com/workers/vite-plugin/tutorial)
- [Cloudflare: Claude Code + Cloudflare](https://developers.cloudflare.com/agent-setup/claude-code/)
- [Svelte: plugin para Claude Code](https://svelte.dev/docs/ai/claude-plugin)
- [Flavio Copes: Cloudflare Pages vs Workers (nov. 2026)](https://flaviocopes.com/cloudflare-pages-vs-workers/)
- [WebKit: no convertir imágenes salvo con accept restringido (2024)](https://github.com/WebKit/WebKit/commit/02a5c284178e4c4c9184cf721954243d59678a03)
- [WebKit: se restaura la conversión de HEIC a JPEG (2024)](https://github.com/WebKit/WebKit/commit/5b0e147c095567387a080a2da87c79f95ed04744)
- [Prueba de HEIC en iOS Safari (zenn.dev)](https://zenn.dev/link/comments/c356d4558e16ad)
- [Foro de Apple: Safari 17 convierte a HEIC con image/heic en accept](https://developer.apple.com/forums/thread/743049)
- [caniuse: Screen Wake Lock API](https://caniuse.com/wake-lock)
- [PhotoSwipe](https://photoswipe.com) · [plugin de video de PhotoSwipe](https://github.com/dimsemenov/photoswipe-video-plugin)
