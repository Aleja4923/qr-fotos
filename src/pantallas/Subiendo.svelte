<script lang="ts">
  import { onMount } from 'svelte';
  import FilaSubida from '../lib/componentes/FilaSubida.svelte';
  import Icono from '../lib/componentes/Icono.svelte';
  import Perla from '../lib/componentes/Perla.svelte';
  import { invitado, mesa, subidas } from '../lib/mock';

  let listas = $derived(subidas.filter((s) => s.estado === 'lista').length);

  // Mockup: simula que la subida termina y pasa a "Listo". Se quita al conectar Uppy.
  onMount(() => {
    const espera = setTimeout(() => (location.hash = '#listo'), 5000);
    return () => clearTimeout(espera);
  });
</script>

<main class="pantalla">
  <header class="barra">
    <a href="#inicio" class="atras" aria-label="Volver al inicio"><Icono nombre="atras" /></a>
    <h1>Subiendo tus fotos</h1>
  </header>

  <section class="resumen">
    <div class="perlas" aria-hidden="true">
      {#each subidas as s (s.id)}
        <Perla encendida={s.estado === 'lista'} tamano={30} />
      {/each}
    </div>
    <p class="conteo"><strong>{listas} de {subidas.length}</strong> ya son perlas del corazón</p>
    <p class="quien">Mesa {mesa} · {invitado}</p>
  </section>

  <p class="aviso">
    <Icono nombre="senal" tamano={20} />
    <span>Deja esta página abierta hasta que termine. Si se va la señal, la subida sigue sola.</span>
  </p>

  <ul class="lista">
    {#each subidas as subida (subida.id)}
      <FilaSubida {subida} />
    {/each}
  </ul>
</main>

<style>
  .pantalla {
    min-height: 100dvh;
    padding: 0 var(--margen) calc(var(--e-6) + env(safe-area-inset-bottom));
  }

  .barra {
    display: flex;
    align-items: center;
    gap: var(--e-2);
    padding-top: calc(var(--e-3) + env(safe-area-inset-top));
    margin-left: -12px;
  }

  .atras {
    display: grid;
    place-items: center;
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

  .resumen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--e-2);
    padding: var(--e-6) 0 var(--e-5);
    text-align: center;
  }

  .perlas {
    display: flex;
    gap: var(--e-2);
    margin-bottom: var(--e-2);
  }

  .conteo {
    font-size: var(--t-cuerpo);
  }

  .conteo strong {
    font-family: var(--font-numero);
    font-size: 28px;
    font-style: italic;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }

  .quien {
    color: var(--tinta-suave);
    font-size: var(--t-dato);
  }

  .aviso {
    display: flex;
    gap: var(--e-3);
    padding: var(--e-4) var(--e-4);
    border: 1px solid var(--rosa);
    outline: 1px solid var(--rosa);
    outline-offset: -5px;
    border-radius: var(--r-aviso);
    color: var(--rosa-tinta);
    font-size: var(--t-dato);
    line-height: 1.4;
  }

  .aviso :global(svg) {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .lista {
    margin: var(--e-3) 0 0;
    padding: 0;
    list-style: none;
  }
</style>
