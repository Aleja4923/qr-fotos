<script lang="ts">
  import Boton from '../lib/componentes/Boton.svelte';
  import Icono from '../lib/componentes/Icono.svelte';
  import { fotosSubidas, invitado, mesa } from '../lib/mock';
</script>

<!-- Mockup estático del visor; en la versión real lo hace PhotoSwipe 5. -->
<main class="pantalla">
  <header class="barra">
    <a href="#galeria" class="cerrar" aria-label="Cerrar y volver a la galería"><Icono nombre="cerrar" /></a>
    <p>3 de {fotosSubidas}</p>
    <span class="espacio"></span>
  </header>

  <div class="foto">
    <span class="relleno"><Icono nombre="imagen" tamano={44} /></span>
  </div>

  <section class="datos">
    <p class="autor">Subida por <span>{invitado}</span></p>
    <p class="detalle">Mesa {mesa} · 9:42 p. m.</p>
  </section>

  <div class="acciones">
    <div class="pasar">
      <Boton variante="sombra" icono="atras">Anterior</Boton>
      <Boton variante="sombra" icono="siguiente" iconoDespues>Siguiente</Boton>
    </div>
    <Boton variante="claro" icono="descargar">Descargar</Boton>
  </div>
</main>

<style>
  .pantalla {
    --foco: var(--papel);
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    background: var(--noche);
    color: var(--papel);
  }

  .barra {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: calc(var(--e-2) + env(safe-area-inset-top)) var(--e-3) var(--e-2);
    font-size: var(--t-dato);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  .cerrar,
  .espacio {
    display: grid;
    place-items: center;
    width: var(--toque);
    height: var(--toque);
    border-radius: var(--r-redondo);
  }

  .foto {
    padding: var(--e-4) 0;
  }

  .relleno {
    display: grid;
    place-items: center;
    aspect-ratio: 4 / 5;
    max-height: 50dvh;
    margin: 0 auto;
    background: var(--nacar-rosa);
    color: var(--rosa);
  }

  /* Doble filete rosado sobre los datos, como el marco de las tarjetas. */
  .datos {
    display: flex;
    flex-direction: column;
    gap: var(--e-1);
    margin: 0 var(--margen);
    padding-top: var(--e-3);
    border-top: 3px double var(--rosa);
  }

  .autor {
    font-family: var(--font-serif);
    font-size: var(--t-serif);
    font-style: italic;
  }

  .autor span {
    font-style: normal;
    font-weight: 500;
  }

  .detalle {
    color: var(--noche-texto-suave);
    font-size: var(--t-dato);
  }

  .acciones {
    display: flex;
    flex-direction: column;
    gap: var(--e-3);
    margin-top: auto;
    padding: var(--e-5) var(--margen) calc(var(--e-6) + env(safe-area-inset-bottom));
  }
  .pasar {
    display: flex;
    gap: var(--e-3);
  }
</style>
