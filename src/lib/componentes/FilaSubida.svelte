<script lang="ts">
  import HiloPerlas from './HiloPerlas.svelte';
  import Icono from './Icono.svelte';
  import Perla from './Perla.svelte';
  import type { Subida } from '../mock';

  interface Props {
    subida: Subida;
  }

  let { subida }: Props = $props();
</script>

<li class={['fila', subida.estado]}>
  <span class="miniatura"><Icono nombre="imagen" tamano={22} /></span>

  <div class="info">
    <div class="linea">
      <p class="nombre">{subida.nombre}</p>
      <p class="tamano">{subida.tamano}</p>
    </div>
    {#if subida.estado === 'subiendo'}
      <HiloPerlas valor={subida.progreso} etiqueta="Subiendo {subida.nombre}" />
    {:else}
      <p class="estado">
        <Perla encendida={subida.estado === 'lista'} tamano={16} />
        {subida.estado === 'lista' ? 'Subida' : 'En espera'}
      </p>
    {/if}
  </div>
</li>

<style>
  .fila {
    display: flex;
    align-items: center;
    gap: var(--e-4);
    padding: var(--e-4) 0;
  }

  .fila + :global(.fila) {
    border-top: 1px solid color-mix(in srgb, var(--rosa) 55%, transparent);
  }

  .miniatura {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border-radius: var(--r-redondo);
    background: var(--papel-hondo);
    color: var(--rosa-tinta);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--rosa) 60%, transparent);
  }

  .info {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--e-2);
    min-width: 0;
  }

  .linea {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--e-3);
  }

  .nombre {
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .tamano {
    flex-shrink: 0;
    color: var(--tinta-suave);
    font-size: var(--t-dato);
    font-variant-numeric: tabular-nums;
  }

  .estado {
    display: flex;
    align-items: center;
    gap: var(--e-2);
    color: var(--tinta-suave);
    font-size: var(--t-dato);
    font-weight: 500;
  }

  .lista .estado {
    color: var(--rosa-tinta);
  }
</style>
