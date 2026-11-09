<script lang="ts">
  import Boton from '../lib/componentes/Boton.svelte';
  import CorazonPerlas from '../lib/componentes/CorazonPerlas.svelte';
  import { PERLAS_DEL_CORAZON } from '../lib/corazon';
  import { galeria } from '../lib/galeria.svelte';
  import { invitado } from '../lib/invitado.svelte';
  import { subirArchivos } from '../lib/subidas.svelte';

  let total = $derived(galeria.fotos.length);
  let brillan = $derived(
    total === 0
      ? 'tus fotos pueden ser las primeras perlas del corazón'
      : total === 1
        ? '1 foto ya brilla en el corazón'
        : `${total} fotos ya brillan en el corazón`,
  );
</script>

<main class="pantalla">
  <header class="portada">
    <CorazonPerlas capacidad={PERLAS_DEL_CORAZON} encendidas={total} ancho={236}>
      <span class="treinta">30</span>
    </CorazonPerlas>
    <p class="ocasion">Aniversario · Bodas de Perla</p>
    <h1 class="nombres">Javier <span class="y">&amp;</span> Patricia</h1>
  </header>

  <section class="acciones" aria-label="Comparte tus fotos">
    <p class="mesa" aria-live="polite">
      {#if galeria.estado === 'lista'}
        {#if invitado.mesa !== null}<strong>Mesa {invitado.mesa}</strong> ·{/if}
        {brillan}
      {:else if invitado.mesa !== null}
        <strong>Mesa {invitado.mesa}</strong>
      {/if}
    </p>
    <label class="campo">
      <span>Tu nombre <em>(opcional)</em></span>
      <input
        type="text"
        name="nombre"
        placeholder="Así sabrán quién tomó la foto"
        autocomplete="name"
        enterkeyhint="done"
        maxlength="60"
        bind:value={invitado.nombre}
      />
    </label>
    <Boton icono="camara" onarchivos={subirArchivos}>Subir fotos y videos</Boton>
    <Boton variante="marco" icono="galeria" href="#galeria">Ver la galería</Boton>
    <p class="reglas">
      <span>Sin registrarte ·</span> <span>en calidad original ·</span> <span>videos de hasta 1 minuto</span>
    </p>
  </section>
</main>

<style>
  .pantalla {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    padding: calc(var(--e-4) + env(safe-area-inset-top)) var(--margen)
      calc(var(--e-5) + env(safe-area-inset-bottom));
  }

  .portada {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .treinta {
    color: var(--tinta);
    font-family: var(--font-numero);
    font-size: var(--t-treinta);
    font-style: italic;
    font-weight: 400;
    line-height: 1;
    /* La itálica se inclina: se compensa para que quede al centro del corazón. */
    transform: translate(-3px, 2px);
  }

  .ocasion {
    margin-top: var(--e-2);
    color: var(--rosa-tinta);
    font-family: var(--font-serif);
    font-size: var(--t-ocasion);
    font-style: italic;
  }

  .nombres {
    margin-top: var(--e-5);
    font-family: var(--font-caligrafia);
    font-size: var(--t-nombres);
    font-weight: 400;
    line-height: 1.25;
    text-wrap: balance;
  }

  .y {
    color: var(--rosa-tinta);
  }

  .acciones {
    display: flex;
    flex-direction: column;
    gap: var(--e-3);
    padding-top: var(--e-6);
  }

  .mesa {
    min-height: 1.5em;
    color: var(--tinta-suave);
    font-size: var(--t-dato);
    text-align: center;
    text-wrap: balance;
  }

  .mesa strong {
    color: var(--tinta);
    font-weight: 600;
  }

  .campo {
    display: flex;
    flex-direction: column;
    gap: var(--e-2);
    margin-bottom: var(--e-1);
    font-size: var(--t-dato);
    font-weight: 500;
  }

  .campo em {
    color: var(--tinta-suave);
    font-style: normal;
    font-weight: 400;
  }

  input {
    min-height: 50px;
    padding: 0 var(--e-4);
    border: 0;
    border-bottom: 1.5px solid var(--rosa);
    border-radius: 0;
    background: color-mix(in srgb, var(--papel) 70%, transparent);
    font-size: var(--t-cuerpo);
    font-weight: 400;
  }

  input::placeholder {
    color: var(--tinta-suave);
  }

  input:focus-visible {
    outline: none;
    border-bottom-color: var(--tinta);
    background: var(--papel);
  }

  .reglas span {
    white-space: nowrap;
  }

  .reglas {
    margin-top: var(--e-1);
    text-wrap: balance;
    color: var(--tinta-suave);
    font-size: var(--t-pequeno);
    text-align: center;
  }
</style>
