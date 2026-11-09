<script lang="ts">
  import type { Snippet } from 'svelte';
  import { perlasCorazon } from '../corazon';

  interface Props {
    /** Perlas que caben en el corazón. */
    capacidad: number;
    /** Perlas encendidas (fotos subidas). */
    encendidas: number;
    /** Ancho en píxeles. */
    ancho?: number;
    /** Enciende las perlas una por una al aparecer. */
    animar?: boolean;
    /** Solo las últimas `nuevas` perlas se encienden con animación (las demás ya estaban). */
    nuevas?: number;
    /** Espera antes de encender las perlas nuevas, en ms. */
    retraso?: number;
    /** Lo que va dentro del corazón (el "30"). */
    children?: Snippet;
  }

  let {
    capacidad,
    encendidas,
    ancho = 220,
    animar = true,
    nuevas = 0,
    retraso = 150,
    children,
  }: Props = $props();

  const id = $props.id();
  let perlas = $derived(perlasCorazon(capacidad));
  let limite = $derived(Math.min(encendidas, capacidad));
  let primeraNueva = $derived(nuevas > 0 ? limite - nuevas : 0);
</script>

<div class="corazon" style:width="{ancho}px">
  <svg viewBox="-18 -13.6 36 32" aria-hidden="true">
    <defs>
      <radialGradient id="perla-{id}" cx="0.32" cy="0.28" r="0.85">
        <stop offset="0" stop-color="var(--perla-luz)" />
        <stop offset="0.45" stop-color="var(--perla)" />
        <stop offset="1" stop-color="var(--perla-sombra)" />
      </radialGradient>
      <filter id="sombra-{id}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0.14" stdDeviation="0.12" flood-color="#3b2a22" flood-opacity="0.3" />
      </filter>
    </defs>
    {#each perlas as perla, i (i)}
      {#if i < limite}
        <circle
          class={['perla', { animar: animar && i >= primeraNueva, nueva: nuevas > 0 && i >= primeraNueva }]}
          style:--i={i - primeraNueva}
          style:--retraso="{retraso}ms"
          cx={perla.x}
          cy={perla.y}
          r={perla.r}
          fill="url(#perla-{id})"
          filter="url(#sombra-{id})"
        />
      {:else}
        <circle class="hueco" cx={perla.x} cy={perla.y} r={perla.r * 0.82} />
      {/if}
    {/each}
  </svg>
  {#if children}
    <div class="dentro">{@render children()}</div>
  {/if}
</div>

<style>
  .corazon {
    position: relative;
    flex-shrink: 0;
  }

  svg {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  /* Perla todavía apagada: mate y pálida, para que la silueta del corazón siempre se lea. */
  .hueco {
    fill: var(--perla-mate);
    stroke: var(--rosa);
    stroke-width: 0.1;
  }

  /* Las perlas que acaba de sumar el invitado quedan engarzadas en rosa. */
  .perla.nueva {
    stroke: var(--rosa-tinta);
    stroke-width: 0.34;
    transform: scale(1.12);
  }

  .perla {
    /* Un filete casi invisible para que la perla se separe del papel claro. */
    stroke: var(--perla-filete);
    stroke-width: 0.1;
    transform-box: fill-box;
    transform-origin: center;
  }

  .perla.animar {
    animation: encender 520ms var(--salida) both;
    animation-delay: calc(var(--i) * 22ms + var(--retraso));
  }

  /* Las perlas que acaba de sumar el invitado llegan más despacio, una tras otra. */
  .perla.animar.nueva {
    animation-duration: 700ms;
    animation-delay: calc(var(--i) * 260ms + var(--retraso));
  }

  @keyframes encender {
    from {
      opacity: 0;
      transform: scale(0.3);
    }
  }

  .perla.animar.nueva {
    animation-name: encender-nueva;
  }

  @keyframes encender-nueva {
    from {
      opacity: 0;
      transform: scale(0.3);
    }
    to {
      transform: scale(1.12);
    }
  }

  .dentro {
    position: absolute;
    inset: 0 0 6% 0;
    display: grid;
    place-items: center;
  }

  @media (prefers-reduced-motion: reduce) {
    .perla.animar {
      animation: none;
    }
  }
</style>
