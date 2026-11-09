<script lang="ts">
  import { onMount } from 'svelte';
  import Boton from '../lib/componentes/Boton.svelte';
  import CorazonPerlas from '../lib/componentes/CorazonPerlas.svelte';
  import { fotosSubidas, invitado, perlasDelCorazon, subidas } from '../lib/mock';

  const RETRASO = 500; // ms antes de la primera perla nueva
  const PASO = 260; // ms entre perlas (igual que en CorazonPerlas)

  let nombre = $derived(invitado.split(' ')[0]);
  let total = $derived(fotosSubidas + subidas.length);

  // El número del corazón sube al ritmo en que se encienden las perlas de Laura.
  let cuenta = $state(fotosSubidas);

  onMount(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cuenta = total;
      return;
    }
    const relojes = subidas.map((_, i) =>
      setTimeout(() => (cuenta = fotosSubidas + i + 1), RETRASO + i * PASO + 350),
    );
    return () => relojes.forEach(clearTimeout);
  });
</script>

<main class="pantalla">
  <section class="confirmacion">
    <CorazonPerlas
      capacidad={perlasDelCorazon}
      encendidas={total}
      nuevas={subidas.length}
      retraso={RETRASO}
      ancho={232}
    >
      <span class="cuenta" aria-label="{total} fotos en el corazón">{cuenta}</span>
    </CorazonPerlas>

    <h1>¡Gracias, {nombre}!</h1>
    <p class="mensaje">
      Tus {subidas.length} fotos quedaron guardadas para Javier &amp; Patricia.
    </p>
    <p class="nota">Son las {subidas.length} perlas nuevas del corazón.</p>
  </section>

  <div class="acciones">
    <Boton icono="camara" href="#subiendo">Subir más fotos</Boton>
    <Boton variante="marco" icono="galeria" href="#galeria">Ver la galería</Boton>
  </div>
</main>

<style>
  .pantalla {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    padding: calc(var(--e-4) + env(safe-area-inset-top)) var(--margen)
      calc(var(--e-5) + env(safe-area-inset-bottom));
  }

  .confirmacion {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .cuenta {
    font-family: var(--font-numero);
    font-size: var(--t-cuenta);
    font-style: italic;
    font-weight: 400;
    line-height: 1;
    transform: translate(-3px, 2px);
  }

  h1 {
    margin-top: var(--e-5);
    font-family: var(--font-caligrafia);
    font-size: var(--t-gracias);
    font-weight: 400;
    line-height: 1.3;
    animation: llegar 600ms 200ms var(--salida) both;
  }

  .mensaje {
    max-width: 28ch;
    margin-top: var(--e-2);
    font-family: var(--font-serif);
    font-size: var(--t-serif);
    line-height: 1.35;
    text-wrap: balance;
    animation: llegar 600ms 300ms var(--salida) both;
  }

  .nota {
    margin-top: var(--e-3);
    color: var(--rosa-tinta);
    font-size: var(--t-dato);
    animation: llegar 600ms 400ms var(--salida) both;
  }

  @keyframes llegar {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }

  .acciones {
    display: flex;
    flex-direction: column;
    gap: var(--e-3);
    padding-top: var(--e-5);
  }

  @media (prefers-reduced-motion: reduce) {
    h1,
    .mensaje,
    .nota {
      animation: none;
    }
  }
</style>
