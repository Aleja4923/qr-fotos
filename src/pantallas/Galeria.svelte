<script lang="ts">
  import { onMount } from 'svelte';
  import Boton from '../lib/componentes/Boton.svelte';
  import CorazonPerlas from '../lib/componentes/CorazonPerlas.svelte';
  import Icono from '../lib/componentes/Icono.svelte';
  import Miniatura from '../lib/componentes/Miniatura.svelte';
  import { PERLAS_DEL_CORAZON } from '../lib/corazon';
  import { galeria, type Filtro } from '../lib/galeria.svelte';
  import { subirArchivos } from '../lib/subidas.svelte';

  onMount(() => galeria.seguir());

  let filtros = $derived<{ valor: Filtro; texto: string }[]>([
    { valor: 'todas', texto: 'Todas' },
    ...(galeria.hayVideos ? [{ valor: 'videos' as const, texto: 'Videos' }] : []),
    ...galeria.mesas.map((m) => ({ valor: m, texto: `Mesa ${m}` })),
  ]);
</script>

<main class="pantalla">
  <header class="encabezado">
    <div class="titulo">
      <a href="#inicio" class="atras" aria-label="Volver al inicio"><Icono nombre="atras" /></a>
      <div>
        <h1>Galería</h1>
        <p>Las fotos y videos de la fiesta</p>
      </div>
    </div>
    <CorazonPerlas capacidad={PERLAS_DEL_CORAZON} encendidas={galeria.fotos.length} ancho={88} animar={false}>
      <span class="cuenta">{galeria.fotos.length}</span>
    </CorazonPerlas>
  </header>

  {#if galeria.estado === 'cargando'}
    <p class="mensaje" role="status">Buscando las fotos…</p>
  {:else if galeria.estado === 'error'}
    <div class="mensaje" role="status">
      <p>No pudimos traer las fotos. Puede ser la señal del salón.</p>
      <button type="button" class="reintentar" onclick={() => galeria.actualizar()}>Intentar de nuevo</button>
    </div>
  {:else if galeria.fotos.length === 0}
    <div class="mensaje">
      <p class="vacia">Todavía no hay fotos.</p>
      <p>Las primeras perlas del corazón pueden ser las tuyas.</p>
    </div>
  {:else}
    {#if filtros.length > 2}
      <div class="filtros" role="group" aria-label="Filtrar galería">
        {#each filtros as filtro (filtro.valor)}
          <button
            type="button"
            class={['filtro', { activo: filtro.valor === galeria.filtro }]}
            aria-pressed={filtro.valor === galeria.filtro}
            onclick={() => (galeria.filtro = filtro.valor)}
          >
            {filtro.texto}
          </button>
        {/each}
      </div>
    {/if}

    {#if galeria.visibles.length === 0}
      <p class="mensaje">No hay fotos con este filtro todavía.</p>
    {:else}
      <div class="cuadricula">
        {#each galeria.visibles as foto (foto.id)}
          <Miniatura {foto} />
        {/each}
      </div>
    {/if}
  {/if}

  <div class="flotante">
    <Boton icono="mas" onarchivos={subirArchivos}>Subir mis fotos</Boton>
  </div>
</main>

<style>
  .pantalla {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  .encabezado {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--e-4);
    padding: calc(var(--e-4) + env(safe-area-inset-top)) var(--margen) var(--e-4);
  }

  .titulo {
    display: flex;
    align-items: center;
    gap: var(--e-1);
    min-width: 0;
    margin-left: -12px;
  }

  .atras {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: var(--toque);
    height: var(--toque);
    border-radius: var(--r-redondo);
  }

  h1 {
    font-family: var(--font-serif);
    font-size: var(--t-titulo);
    font-weight: 400;
    line-height: 1.1;
  }

  .encabezado p {
    margin-top: 2px;
    color: var(--tinta-suave);
    font-size: var(--t-dato);
  }

  .cuenta {
    font-family: var(--font-numero);
    font-size: 22px;
    font-style: italic;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }

  .filtros {
    display: flex;
    gap: var(--e-2);
    padding: 0 var(--margen) var(--e-4);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .filtro {
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
    transition: background-color 160ms var(--salida);
  }

  .filtro.activo {
    border-color: var(--tinta);
    background: var(--tinta);
    color: var(--papel);
  }

  .cuadricula {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--e-2);
    padding: var(--e-1) var(--e-4) 0;
  }

  .mensaje {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--e-3);
    padding: var(--e-7) var(--margen) 0;
    color: var(--tinta-suave);
    font-size: var(--t-cuerpo);
    text-align: center;
    text-wrap: balance;
  }

  .vacia {
    color: var(--tinta);
    font-family: var(--font-serif);
    font-size: var(--t-resumen);
    font-style: italic;
  }

  .reintentar {
    min-height: var(--toque);
    padding: 0 var(--e-5);
    border: 1px solid var(--rosa);
    border-radius: var(--r-redondo);
    background: transparent;
    color: var(--tinta);
    font-size: var(--t-dato);
    font-weight: 600;
    cursor: pointer;
  }

  .flotante {
    /* Abajo de la pantalla aunque haya pocas fotos; flota al desplazar si hay muchas. */
    position: sticky;
    bottom: 0;
    margin-top: auto;
    padding: var(--e-7) var(--margen) calc(var(--e-5) + env(safe-area-inset-bottom));
    /* Velo de papel para que las fotos no asomen bajo el botón. */
    background: linear-gradient(to bottom, transparent, var(--papel) 55%);
  }
</style>
