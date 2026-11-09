<script lang="ts">
  import HiloPerlas from './HiloPerlas.svelte';
  import Icono from './Icono.svelte';
  import Perla from './Perla.svelte';
  import { duracion, tamano } from '../formato';
  import { subidas, type Subida } from '../subidas.svelte';

  interface Props {
    subida: Subida;
  }

  let { subida }: Props = $props();

  let detalle = $derived(
    subida.duracion !== null ? `${tamano(subida.tamano)} · ${duracion(subida.duracion)}` : tamano(subida.tamano),
  );
  let enCamino = $derived(subida.estado === 'subiendo' || subida.estado === 'guardando');
</script>

<li class={['fila', subida.estado]}>
  <span class="miniatura">
    {#if subida.vista}
      <img src={subida.vista} alt="" />
    {:else}
      <Icono nombre={subida.tipo === 'video' ? 'play' : 'imagen'} tamano={22} />
    {/if}
  </span>

  <div class="info">
    <div class="linea">
      <p class="nombre">{subida.nombre}</p>
      <p class="tamano">{detalle}</p>
    </div>

    {#if enCamino}
      <HiloPerlas valor={subida.progreso} etiqueta="Subiendo {subida.nombre}" />
    {:else if subida.estado === 'error' || subida.estado === 'rechazada'}
      <div class="problema">
        <p class="estado" role="status">{subida.motivo}</p>
        {#if subida.estado === 'error'}
          <button type="button" class="accion" onclick={() => subidas.reintentar(subida.id)}>Reintentar</button>
        {:else}
          <button type="button" class="accion" onclick={() => subidas.quitar(subida.id)}>Quitar</button>
        {/if}
      </div>
    {:else}
      <p class="estado">
        <Perla encendida={subida.estado === 'lista'} tamano={16} />
        {#if subida.estado === 'lista'}
          Subida
        {:else if subida.estado === 'preparando'}
          Preparando…
        {:else}
          {subida.motivo ?? 'En espera'}
        {/if}
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
    overflow: hidden;
    border-radius: var(--r-redondo);
    background: var(--papel-hondo);
    color: var(--rosa-tinta);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--rosa) 60%, transparent);
  }

  .miniatura img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .rechazada .miniatura img {
    opacity: 0.45;
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

  .problema {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--e-3);
  }

  .error .estado,
  .rechazada .estado {
    color: var(--rosa-tinta);
  }

  .accion {
    flex-shrink: 0;
    min-height: 40px;
    padding: 0 var(--e-4);
    border: 1px solid var(--rosa);
    border-radius: var(--r-redondo);
    background: transparent;
    color: var(--tinta);
    font-size: var(--t-dato);
    font-weight: 600;
    cursor: pointer;
  }
</style>
