<script lang="ts">
  // Progreso como un hilo de perlas que se va enhebrando. La última perla se llena
  // en la proporción exacta que falta, así el largo del hilo es una medida real.
  interface Props {
    /** De 0 a 1. */
    valor: number;
    etiqueta: string;
    perlas?: number;
  }

  let { valor, etiqueta, perlas = 14 }: Props = $props();

  const id = $props.id();
  let v = $derived(Math.min(Math.max(valor, 0), 1));
  let porcentaje = $derived(Math.round(v * 100));
  let llenas = $derived(v * perlas);
</script>

<div
  class="hilo"
  style:aspect-ratio={perlas}
  role="progressbar"
  aria-label={etiqueta}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={porcentaje}
>
  <svg viewBox="0 0 {perlas * 2} 2" aria-hidden="true">
    <defs>
      <radialGradient id="h-{id}" cx="0.32" cy="0.3" r="0.8">
        <stop offset="0" stop-color="var(--perla-luz)" />
        <stop offset="0.5" stop-color="var(--perla)" />
        <stop offset="1" stop-color="var(--perla-sombra)" />
      </radialGradient>
    </defs>
    <line x1="1" y1="1" x2={perlas * 2 - 1} y2="1" class="cuerda" />
    {#each { length: perlas }, i (i)}
      {@const lleno = Math.min(Math.max(llenas - i, 0), 1)}
      <circle cx={i * 2 + 1} cy="1" r="0.42" class="vacia" />
      {#if lleno > 0}
        <circle cx={i * 2 + 1} cy="1" r={0.25 + 0.6 * lleno} fill="url(#h-{id})" class="llena" />
      {/if}
    {/each}
  </svg>
</div>

<style>
  .hilo {
    width: 100%;
  }

  svg {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .cuerda {
    stroke: var(--rosa);
    stroke-width: 0.08;
  }

  .vacia {
    fill: var(--perla-mate);
    stroke: var(--rosa);
    stroke-width: 0.08;
  }

  .llena {
    stroke: var(--perla-filete);
    stroke-width: 0.05;
  }
</style>
