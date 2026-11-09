<script lang="ts">
  import Boton from '../lib/componentes/Boton.svelte';
  import FilaSubida from '../lib/componentes/FilaSubida.svelte';
  import Icono from '../lib/componentes/Icono.svelte';
  import Perla from '../lib/componentes/Perla.svelte';
  import { invitado } from '../lib/invitado.svelte';
  import { irA } from '../lib/rutas';
  import { subidas, subirArchivos } from '../lib/subidas.svelte';

  let quien = $derived(
    [invitado.mesa !== null ? `Mesa ${invitado.mesa}` : null, invitado.autor].filter(Boolean).join(' · '),
  );
  let porSubir = $derived(subidas.lista.length - subidas.rechazadas);
  /** Todo salió bien: pasa sola a "Listo". Si algo falló o se rechazó, se queda para que lo vea. */
  let todoBien = $derived(subidas.terminado && subidas.listas > 0 && subidas.conError === 0 && subidas.rechazadas === 0);

  $effect(() => {
    if (!todoBien) return;
    const espera = setTimeout(() => irA('#listo'), 900);
    return () => clearTimeout(espera);
  });
</script>

<main class="pantalla">
  <header class="barra">
    <a href="#inicio" class="atras" aria-label="Volver al inicio"><Icono nombre="atras" /></a>
    <h1>{subidas.terminado ? 'Tus fotos' : 'Subiendo tus fotos'}</h1>
  </header>

  {#if subidas.lista.length === 0}
    <section class="vacio">
      <p>Todavía no has elegido fotos ni videos.</p>
      <Boton icono="camara" onarchivos={subirArchivos}>Subir fotos y videos</Boton>
    </section>
  {:else}
    <section class="resumen">
      <div class="perlas" aria-hidden="true">
        {#each subidas.lista as s (s.id)}
          {#if s.estado !== 'rechazada'}
            <Perla encendida={s.estado === 'lista'} tamano={subidas.lista.length > 12 ? 18 : 30} />
          {/if}
        {/each}
      </div>
      <p class="conteo" aria-live="polite">
        <strong>{subidas.listas} de {porSubir}</strong> ya son perlas del corazón
      </p>
      {#if quien}<p class="quien">{quien}</p>{/if}
    </section>

    {#if !subidas.enLinea && subidas.ocupado}
      <p class="aviso" role="status">
        <Icono nombre="senal" tamano={20} />
        <span>Se fue la señal. Tus fotos esperan aquí y siguen solas cuando vuelva.</span>
      </p>
    {:else if subidas.ocupado}
      <p class="aviso">
        <Icono nombre="senal" tamano={20} />
        <span>Deja esta página abierta hasta que termine. Si se va la señal, la subida sigue sola.</span>
      </p>
    {:else if subidas.conError > 0}
      <p class="aviso" role="status">
        <Icono nombre="senal" tamano={20} />
        <span>
          {subidas.conError === 1 ? 'Una no se pudo subir' : `${subidas.conError} no se pudieron subir`}. Puede ser la
          señal: vuelve a intentarlo en un momento.
        </span>
      </p>
    {/if}

    <ul class="lista">
      {#each subidas.lista as subida (subida.id)}
        <FilaSubida {subida} />
      {/each}
    </ul>

    <div class="acciones">
      {#if subidas.conError > 1}
        <Boton onclick={() => subidas.reintentarTodas()}>Reintentar todas</Boton>
      {/if}
      {#if subidas.terminado && subidas.listas > 0 && !todoBien}
        <Boton href="#listo">Continuar</Boton>
      {/if}
      <Boton variante="marco" icono="mas" onarchivos={subirArchivos}>Agregar más</Boton>
    </div>
  {/if}
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

  .perlas {
    flex-wrap: wrap;
    justify-content: center;
  }

  .acciones {
    display: flex;
    flex-direction: column;
    gap: var(--e-3);
    padding-top: var(--e-5);
  }

  .vacio {
    display: flex;
    flex-direction: column;
    gap: var(--e-5);
    padding-top: var(--e-7);
    color: var(--tinta-suave);
    font-family: var(--font-serif);
    font-size: var(--t-serif);
    text-align: center;
  }
</style>
