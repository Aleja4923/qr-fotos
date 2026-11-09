<script lang="ts">
  import { onMount } from 'svelte';
  import Boton from '../lib/componentes/Boton.svelte';
  import CorazonPerlas from '../lib/componentes/CorazonPerlas.svelte';
  import Icono from '../lib/componentes/Icono.svelte';
  import { PERLAS_DEL_CORAZON } from '../lib/corazon';
  import { galeria } from '../lib/galeria.svelte';
  import { invitado } from '../lib/invitado.svelte';
  import { subidas, subirArchivos } from '../lib/subidas.svelte';

  const RETRASO = 500; // ms antes de la primera perla nueva
  const PASO = 260; // ms entre perlas (igual que en CorazonPerlas)

  // Se fija al llegar: si la galería se actualiza mientras tanto, la animación no salta.
  const nuevas = subidas.listas;
  const total = Math.max(galeria.fotos.length, nuevas);
  const nombre = invitado.primerNombre;

  // Solo se animan las perlas que caben en el corazón; el número cuenta todas.
  const perlasNuevas = Math.max(0, Math.min(nuevas, PERLAS_DEL_CORAZON - (total - nuevas)));

  let cuenta = $state(total - nuevas);

  onMount(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || nuevas === 0) {
      cuenta = total;
      return;
    }
    const relojes = Array.from({ length: nuevas }, (_, i) =>
      setTimeout(() => (cuenta = total - nuevas + i + 1), RETRASO + Math.min(i, perlasNuevas) * PASO + 350),
    );
    return () => relojes.forEach(clearTimeout);
  });
</script>

<main class="pantalla">
  <header class="barra">
    <a href="#inicio" class="atras" aria-label="Volver al inicio"><Icono nombre="atras" /></a>
  </header>

  <section class="confirmacion">
    <CorazonPerlas
      capacidad={PERLAS_DEL_CORAZON}
      encendidas={total}
      nuevas={perlasNuevas}
      retraso={RETRASO}
      ancho={232}
    >
      <span class="cuenta" aria-label="{total} fotos en el corazón">{cuenta}</span>
    </CorazonPerlas>

    <h1>{nombre ? `¡Gracias, ${nombre}!` : '¡Gracias!'}</h1>
    {#if nuevas > 0}
      <p class="mensaje">
        {nuevas === 1 ? 'Tu foto quedó guardada' : `Tus ${nuevas} fotos quedaron guardadas`} para Javier &amp; Patricia.
      </p>
      <p class="nota">{nuevas === 1 ? 'Es la perla nueva del corazón.' : `Son las ${nuevas} perlas nuevas del corazón.`}</p>
      {#if !nombre}
        <a class="con-nombre" href="#inicio">Escribir mi nombre para las próximas fotos</a>
      {/if}
    {:else}
      <p class="mensaje">Cada foto que subas se vuelve una perla del corazón de Javier &amp; Patricia.</p>
    {/if}
  </section>

  <div class="acciones">
    <Boton icono="camara" onarchivos={subirArchivos}>Subir más fotos</Boton>
    <Boton variante="marco" icono="galeria" href="#galeria">Ver la galería</Boton>
  </div>
</main>

<style>
  .pantalla {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    padding: calc(var(--e-3) + env(safe-area-inset-top)) var(--margen)
      calc(var(--e-5) + env(safe-area-inset-bottom));
  }

  .barra {
    margin: 0 0 0 -12px;
  }

  .atras {
    display: grid;
    place-items: center;
    width: var(--toque);
    height: var(--toque);
    border-radius: var(--r-redondo);
  }

  .con-nombre {
    display: inline-flex;
    align-items: center;
    min-height: var(--toque);
    margin-top: var(--e-2);
    color: var(--tinta);
    font-size: var(--t-dato);
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: var(--rosa);
    text-underline-offset: 4px;
    animation: llegar 600ms 500ms var(--salida) both;
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
    .nota,
    .con-nombre {
      animation: none;
    }
  }
</style>
