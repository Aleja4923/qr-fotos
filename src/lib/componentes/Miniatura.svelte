<script lang="ts">
  import Icono from './Icono.svelte';
  import type { Foto } from '../api';
  import { duracion } from '../formato';

  interface Props {
    foto: Foto;
  }

  let { foto }: Props = $props();

  let fallo = $state(false);
  let etiqueta = $derived(
    [
      foto.tipo === 'video' ? 'Video' : 'Foto',
      foto.autor ? `de ${foto.autor}` : null,
      foto.mesa !== null ? `mesa ${foto.mesa}` : null,
    ]
      .filter(Boolean)
      .join(', '),
  );
</script>

<a class="miniatura" href="#foto/{foto.id}" aria-label={etiqueta}>
  {#if foto.mini && !fallo}
    <img src={foto.mini} alt="" loading="lazy" decoding="async" width="400" height="400" onerror={() => (fallo = true)} />
  {:else}
    <span class="icono"><Icono nombre={foto.tipo === 'video' ? 'play' : 'imagen'} tamano={26} /></span>
  {/if}
  {#if foto.tipo === 'video'}
    <span class="video">
      <Icono nombre="play" tamano={12} />{foto.duracion !== null ? duracion(foto.duracion) : 'Video'}
    </span>
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
    background: var(--papel-hondo);
  }

  /* Filete rosado, como una foto montada en la tarjeta. Va encima de la imagen. */
  .miniatura::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--rosa) 70%, transparent);
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .icono {
    color: var(--rosa);
  }

  .video {
    position: absolute;
    bottom: 6px;
    left: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 8px;
    border-radius: var(--r-redondo);
    background: color-mix(in srgb, var(--noche) 78%, transparent);
    color: var(--papel);
    font-size: var(--t-pequeno);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    white-space: nowrap;
  }
</style>
