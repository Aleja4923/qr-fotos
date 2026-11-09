<script lang="ts">
  import Boton from '../lib/componentes/Boton.svelte';
  import CorazonPerlas from '../lib/componentes/CorazonPerlas.svelte';
  import Miniatura from '../lib/componentes/Miniatura.svelte';
  import { filtros, fotos, fotosSubidas, perlasDelCorazon } from '../lib/mock';

  // Mockup: el filtro solo cambia de aspecto; todavía no filtra.
  let activo = $state('Todas');
</script>

<main class="pantalla">
  <header class="encabezado">
    <div>
      <h1>Galería</h1>
      <p>Las fotos y videos de la fiesta</p>
    </div>
    <CorazonPerlas capacidad={perlasDelCorazon} encendidas={fotosSubidas} ancho={88} animar={false}>
      <span class="cuenta">{fotosSubidas}</span>
    </CorazonPerlas>
  </header>

  <div class="filtros" role="group" aria-label="Filtrar galería">
    {#each filtros as filtro (filtro)}
      <button
        type="button"
        class={['filtro', { activo: filtro === activo }]}
        aria-pressed={filtro === activo}
        onclick={() => (activo = filtro)}
      >
        {filtro}
      </button>
    {/each}
  </div>

  <div class="cuadricula">
    {#each fotos as foto (foto.id)}
      <Miniatura {foto} href="#foto" />
    {/each}
  </div>

  <div class="flotante">
    <Boton icono="mas" href="#inicio">Subir mis fotos</Boton>
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
