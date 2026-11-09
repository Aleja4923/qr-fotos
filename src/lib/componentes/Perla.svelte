<script lang="ts">
  // Una perla suelta: encendida (perla de verdad) o vacía (hueco del hilo todavía sin perla).
  interface Props {
    encendida?: boolean;
    tamano?: number;
  }

  let { encendida = true, tamano = 14 }: Props = $props();
  const id = $props.id();
</script>

<svg width={tamano} height={tamano} viewBox="-1 -1 2 2" aria-hidden="true">
  {#if encendida}
    <defs>
      <radialGradient id="p-{id}" cx="-0.3" cy="-0.35" r="1.35" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="var(--perla-luz)" />
        <stop offset="0.45" stop-color="var(--perla)" />
        <stop offset="1" stop-color="var(--perla-sombra)" />
      </radialGradient>
    </defs>
    <circle r="0.92" fill="url(#p-{id})" />
  {:else}
    <circle r="0.8" fill="var(--perla-mate)" stroke="var(--rosa)" stroke-width="0.1" />
  {/if}
</svg>
