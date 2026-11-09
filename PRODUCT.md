# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Invitados a la fiesta del aniversario 30 (bodas de perla) de Javier y Patricia. La mayoría son
adultos de 40 a 65 años, amigos de la pareja. Llegan escaneando un QR pegado en su mesa, con el
celular en la mano, en un salón con poca luz, música y señal débil o saturada. Su trabajo:
subir las fotos y videos que tomaron esa noche sin registrarse ni instalar nada, y ver las de
los demás. Javier y Patricia son los destinatarios finales de todo lo que se sube.

## Product Purpose

Juntar en un solo lugar las fotos y videos que los invitados toman durante la fiesta, en su
calidad original, y mostrarlos en una galería compartida. El éxito es que casi todos los
invitados suban algo esa misma noche y que la pareja termine con un archivo completo del evento.

## Positioning

Es una página hecha solo para esta fiesta y esta pareja: se abre desde el QR de la mesa,
sabe en qué mesa está el invitado, no pide cuenta ni app, y guarda los originales en su propio
almacenamiento (R2), no en una red social.

## Operating Context

- Entrada: QR impreso en un sticker por mesa (`?mesa=5`). El sticker es un impreso aparte.
- Uso en la fiesta: celular, una mano, poca luz, distracciones, señal mala; puede cambiarse de
  app o bloquear la pantalla a mitad de una subida.
- Uso después: volver a la galería para ver y descargar.
- Pantallas del invitado: Inicio, Subiendo, Listo, Galería, Foto abierta. Panel privado
  (contraseña, ocultar, borrar) pendiente de diseñar.

## Capabilities and Constraints

- Sube fotos y videos (`accept="image/*,video/*"`, múltiples), sin `capture` ni `image/heic`.
- Videos de máximo 60 s. Miniatura JPEG de 400 px hecha en el celular.
- Nombre del invitado opcional; mesa leída del QR.
- Cola de subidas con progreso por archivo, reintentos y aviso de no cerrar la página.
- Galería que se actualiza sola cada 20–30 s, filtro por mesa y por videos, visor con
  deslizar, autor, mesa, hora y descarga.
- Stack: Vite + Svelte 5 + TypeScript, Uppy, PhotoSwipe 5, Worker de Cloudflare + R2
  (ver docs/frontend-opcion-b.md).
- Sin decidir: qué descarga el botón "Descargar" del visor (miniatura/mediana u original).

## Brand Commitments

- Nombres y ocasión fijos tal como se escriben en la invitación: "Javier & Patricia", monograma "J ♡ P", "30 Aniversario · Bodas de Perla" (confirmado por la usuaria, 2026-11-08).
- La frase de la invitación NO va en la página (la usuaria pidió quitarla, 2026-11-08).
- La invitación impresa es la referencia visual obligatoria (docs/WhatsApp Image 2026-11-08 at 7.22.09 PM.jpeg): tarjetas circulares de papel nacarado marfil, corazón de perlas alrededor del "30", caligrafía en tinta café, detalles rosados, lazo de satén con perla colgante. La página continúa esa papelería.
- El resto del contenido, la identidad visual y los textos se pueden replantear
  (decisión de la usuaria, 2026-11-08), siempre que las reglas del producto sigan siendo ciertas.

## Evidence on Hand

- Invitación impresa real (foto en docs/). Su fecha, hora y lugar existen pero la usuaria decidió no mostrarlos en la página.
- Figma del demo anterior (IMdVYCWxYC2X4Ogs1gQyvS, nodo 4-422): referencia descartada como
  dirección visual; sirve solo como inventario de contenido y funciones.
- No hay fotos reales del evento ni testimonios. No inventarlos.

## Product Principles

1. Subir tiene que ser obvio en el primer segundo: una acción principal, sin pasos previos.
2. Diseñar para la peor señal y la peor luz: estados claros, nada que dependa de verse perfecto.
3. Las fotos de los invitados son el contenido; la interfaz las acompaña.
4. Cálido y personal para esta pareja, nunca genérico de "app de eventos".

## Accessibility & Inclusion

Adultos de 40 a 65 años, a menudo con la letra del celular agrandada: texto grande, contraste
WCAG AA como mínimo, áreas táctiles amplias y que todo funcione con zoom de texto.
