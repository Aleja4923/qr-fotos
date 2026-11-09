<script lang="ts">
  import Icono from './Icono.svelte';
  import type { Foto } from '../mock';

  interface Props {
    foto: Foto;
    href: string;
  }

  let { foto, href }: Props = $props();
</script>

<!-- Mockup: el relleno de color reemplaza la foto real hasta conectar la galería. -->
<a
  class="miniatura"
  {href}
  style:background="var(--{foto.tono})"
  aria-label="{foto.video ? 'Video' : 'Foto'} de la mesa {foto.mesa}"
>
  <span class="icono"><Icono nombre="imagen" tamano={26} /></span>
  {#if foto.video}
    <span class="video"><Icono nombre="play" tamano={12} />{foto.video}</span>
  {/if}
</a>

<style>
  .miniatura {
    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: var(--r-foto);
    /* Filete rosado, como una foto montada en la tarjeta. */
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--rosa) 70%, transparent);
  }

  .icono {
    color: var(--rosa);
  }

  .video {
    position: absolute;
    border-radius: var(--r-redondo);
    font-size: var(--t-pequeno);
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    bottom: 6px;
    left: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 8px;
    background: color-mix(in srgb, var(--noche) 78%, transparent);
    color: var(--papel);
    font-variant-numeric: tabular-nums;
  }
</style>
