---
version: alpha
name: Perlas
description: Sistema visual de la página de fotos del aniversario 30 (bodas de perla) de Patty y Javier. Fuente de verdad en Figma (archivo IMdVYCWxYC2X4Ogs1gQyvS, nodo 4-422).
colors:
  texto: "#2f2a26"
  dorado: "#a88a5a"
  dorado-oscuro: "#6e5634"
  crema: "#f1e9dc"
  borde-dorado: "#e2d4bd"
  texto-suave: "#7a716a"
  superficie: "#ffffff"
  borde: "#e7dfd3"
  blanco: "#ffffff"
  fondo: "#faf7f2"
  verde: "#7e9c6e"
  oscuro: "#1e1b18"
  primary: "{colors.dorado}"
typography:
  display:
    fontFamily: Cormorant Garamond
    fontSize: 46px
    fontWeight: 600
    lineHeight: 1.05
  headline:
    fontFamily: Cormorant Garamond
    fontSize: 38px
    fontWeight: 600
  title:
    fontFamily: Cormorant Garamond
    fontSize: 28px
    fontWeight: 600
  eyebrow:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: 500
    letterSpacing: 3px
  body:
    fontFamily: Montserrat
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  label-lg:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: 600
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: 600
  label-sm:
    fontFamily: Montserrat
    fontSize: 13px
    fontWeight: 600
  caption:
    fontFamily: Montserrat
    fontSize: 12.5px
    fontWeight: 500
  tag:
    fontFamily: Montserrat
    fontSize: 10px
    fontWeight: 600
rounded:
  sm: 12px
  md: 14px
  lg: 16px
  full: 999px
spacing:
  xxs: 4px
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
  page: 28px
components:
  page:
    backgroundColor: "{colors.fondo}"
    textColor: "{colors.texto}"
  button-primary:
    backgroundColor: "{colors.dorado-oscuro}"
    textColor: "{colors.blanco}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 56px
    padding: 0 20px
  button-secondary:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.dorado-oscuro}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 56px
    padding: 0 20px
  button-secondary-border:
    backgroundColor: "{colors.borde-dorado}"
  chip-mesa:
    backgroundColor: "{colors.crema}"
    textColor: "{colors.dorado-oscuro}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 7px 14px
  input:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.texto}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: 50px
    padding: 0 16px
  input-label:
    textColor: "{colors.texto-suave}"
  thumbnail:
    backgroundColor: "{colors.crema}"
    textColor: "{colors.dorado-oscuro}"
    width: 124px
    height: 126px
  thumbnail-tag:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.dorado-oscuro}"
    typography: "{typography.tag}"
    rounded: "{rounded.full}"
    padding: 3px 7px
  upload-row:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.texto}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    padding: 12px
  upload-row-border:
    backgroundColor: "{colors.borde}"
  upload-row-thumb:
    backgroundColor: "{colors.crema}"
    rounded: "{rounded.sm}"
    size: 56px
  upload-row-done:
    backgroundColor: "{colors.verde}"
    rounded: "{rounded.md}"
    size: 28px
  upload-progress:
    backgroundColor: "{colors.dorado}"
    rounded: "{rounded.full}"
    height: 6px
  pearl-necklace:
    backgroundColor: "{colors.fondo}"
    width: 130px
    height: 14px
  viewer:
    backgroundColor: "{colors.oscuro}"
    textColor: "{colors.blanco}"
---

## Overview

Una página móvil cálida y elegante para una celebración de bodas de perla. Se siente como una
invitación impresa en papel crema: tipografía serif clásica para los nombres y títulos, texto
sans limpio para la interfaz, acentos dorados y el collar de perlas como firma visual.
Los invitados llegan escaneando un QR en la mesa, muchas veces con poca señal y con prisa:
todo debe ser obvio, grande y tolerante a errores. Diseño exclusivamente móvil
(referencia de 390 px; se verifica en 375 px y 412 px).

## Colors

Paleta "Perlas": neutros cálidos de papel y un solo acento dorado.

- **fondo (#faf7f2):** Fondo de todas las pantallas claras. Papel crema, nunca blanco puro.
- **superficie (#ffffff):** Tarjetas, campos y botón secundario sobre el fondo.
- **crema (#f1e9dc):** Rellenos suaves: chip de mesa, miniaturas sin cargar.
- **texto (#2f2a26):** Texto principal y títulos.
- **texto-suave (#7a716a):** Etiquetas, tamaños de archivo, notas, metadatos.
- **dorado (#a88a5a):** Acento de marca: progreso, ampersand, viñetas, círculo de confirmación. No lleva texto blanco encima (contraste 3.26:1).
- **dorado-oscuro (#6e5634):** Fondo del botón primario (texto blanco, cumple WCAG AA) y texto sobre crema o blanco cuando debe leerse como dorado (chip, botón secundario, etiquetas).
- **borde (#e7dfd3):** Bordes de tarjetas y campos.
- **borde-dorado (#e2d4bd):** Bordes del botón secundario y del chip de mesa.
- **verde (#7e9c6e):** Solo para estado "subida completa" (check de la fila).
- **blanco (#ffffff):** Texto e iconos sobre dorado-oscuro, verde u oscuro; iconos (no texto) sobre dorado.
- **oscuro (#1e1b18):** Fondo del visor de foto abierta.

## Typography

- **Cormorant Garamond (600)** para lo emocional: nombres (display 46 px, con el "&" en
  cursiva y dorado), confirmaciones (headline 38 px) y títulos de pantalla (title 28 px).
- **Montserrat** para toda la interfaz: cuerpo 15 px / 1.5, botones 16 px semibold,
  nombres de archivo 14 px semibold, chips 13 px, metadatos 12.5 px, etiquetas de
  miniatura 10 px. El eyebrow ("30 AÑOS · BODAS DE PERLA") va en mayúsculas, 12 px,
  medium, con 3 px de tracking.
- Ambas se sirven desde el mismo dominio con Fontsource (no desde Google Fonts), solo con
  los pesos usados: Cormorant Garamond 600 y 600 cursiva; Montserrat 400, 500 y 600.

## Layout

- Columna única a ancho completo; márgenes laterales de 24 px (acciones) a 28 px (encabezado).
- Separación vertical entre controles de 14 px; entre filas de subida 12 px.
- Galería en cuadrícula de 3 columnas con 4 px de separación y 4 px de margen.
- Las acciones principales quedan abajo, al alcance del pulgar; el botón de la galería
  flota a 24 px de los bordes.

## Elevation & Depth

Casi plano. Solo dos sombras, ambas cálidas y suaves, teñidas de dorado:

- Botón primario: `0 6px 8px rgba(168, 138, 89, 0.35)`.
- Círculo de confirmación: `0 10px 24px rgba(168, 138, 89, 0.35)`.

Las perlas llevan una sombra mínima (`0 1px 2px`). Ningún otro elemento tiene sombra;
las tarjetas se separan del fondo con borde de 1 px.

## Shapes

- 12 px: miniatura de la fila de subida.
- 14 px: campos de texto; check de fila completa (círculo de 28 px).
- 16 px: botones y tarjetas de fila de subida.
- 999 px: chips, etiquetas de mesa, barras de progreso.
- Las miniaturas de la galería son rectas (sin radio) para formar un mosaico continuo.

## Components

- **Botón primario:** fondo dorado-oscuro, texto blanco Montserrat 16 px semibold, alto 56 px,
  radio 16 px, icono de 22 px a 10 px del texto, sombra dorada. Solo para la acción de subir
  (y descargar en el visor). Uno por pantalla.
- **Botón secundario:** fondo blanco, borde 1.5 px borde-dorado, texto dorado-oscuro, mismas
  medidas que el primario. Para acciones de apoyo ("Ver la galería").
- **Miniatura (galería):** 124 × 126 px, sin radio, relleno crema mientras carga; etiqueta de
  mesa arriba a la derecha (blanco 85 %, texto 10 px dorado-oscuro, píldora); en videos,
  insignia abajo a la izquierda con icono play y duración (texto al 60 % de opacidad, blanco).
- **Fila de subida:** tarjeta blanca, borde 1 px, radio 16 px, padding 12 px, separación 12 px.
  Miniatura 56 px radio 12 px a la izquierda; nombre (14 px semibold) y tamaño (12.5 px
  texto-suave) en una línea. Estados: *subiendo* (barra de 6 px, pista #efe8dd, relleno
  dorado), *en espera* (texto "En espera"), *lista* ("Subida" + check verde de 28 px con icono blanco de 16 px; es un icono, no texto, y cumple el 3:1 de WCAG para gráficos).
- **Collar de perlas:** 9 perlas en línea, crecientes hacia el centro (radios 4-4-4-5-7-5-4-4-4
  en la versión de 130 × 14 px). Cada perla con degradado radial blanco → #f3eee7 → #d8cfc3
  y sombra mínima. Es un SVG fijo: se escala completo, nunca se redibuja. Va centrado sobre
  los nombres, sobre la confirmación y al lado del título de la galería.
- **Chip de mesa:** píldora crema, borde borde-dorado, texto 13 px semibold dorado-oscuro.
- **Campo de texto:** blanco, borde 1.5 px, radio 14 px, alto 50 px; etiqueta 12 px semibold
  texto-suave arriba con 6 px de separación.

## Do's and Don'ts

- Usa siempre los tokens de `src/styles/tokens.css`; no escribas colores ni medidas sueltas.
- Usa el dorado-oscuro para la acción principal y el dorado solo como acento (progreso, detalles); nunca texto blanco sobre dorado.
- Mantén textos grandes y claros; los invitados leen con poca luz y con prisa.
- No uses degradados morados (ni ningún degradado de fondo ajeno a la paleta).
- No uses sombras grandes ni oscuras; solo las dos sombras doradas descritas.
- No uses fuentes del sistema (system-ui, -apple-system, Arial, Roboto) como tipografía
  visible; solo Cormorant Garamond y Montserrat.
- No uses blanco puro como fondo de página; el fondo es #faf7f2.
- No pongas dos botones primarios en la misma pantalla.
