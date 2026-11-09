<script lang="ts">
  import Boton from '../lib/componentes/Boton.svelte';
  import Icono from '../lib/componentes/Icono.svelte';
  import { hora } from '../lib/formato';
  import { galeria } from '../lib/galeria.svelte';
  import { reemplazar } from '../lib/rutas';

  interface Props {
    id: string | null;
  }

  let { id }: Props = $props();

  // Se pasa entre las fotos del filtro que se estaba mirando en la galería.
  let lista = $derived(galeria.visibles.some((f) => f.id === id) ? galeria.visibles : galeria.fotos);
  let indice = $derived(lista.findIndex((f) => f.id === id));
  let foto = $derived(indice >= 0 ? lista[indice] : null);
  let anterior = $derived(indice > 0 ? lista[indice - 1] : null);
  let siguiente = $derived(indice >= 0 && indice < lista.length - 1 ? lista[indice + 1] : null);

  let detalle = $derived(
    foto ? [foto.mesa !== null ? `Mesa ${foto.mesa}` : null, hora(foto.hora)].filter(Boolean).join(' · ') : '',
  );

  function ir(destino: { id: string } | null) {
    if (destino) reemplazar(`#foto/${encodeURIComponent(destino.id)}`);
  }

  // Precarga la siguiente para que al pasar ya esté lista.
  $effect(() => {
    if (siguiente?.tipo === 'foto') new Image().src = siguiente.url;
  });

  // Deslizar con el dedo: a la izquierda la siguiente, a la derecha la anterior.
  let inicioX = 0;
  let inicioY = 0;
  let deslizando = false;

  function alTocar(evento: PointerEvent) {
    if (!evento.isPrimary) return;
    deslizando = true;
    inicioX = evento.clientX;
    inicioY = evento.clientY;
  }

  function alSoltar(evento: PointerEvent) {
    if (!deslizando) return;
    deslizando = false;
    const dx = evento.clientX - inicioX;
    const dy = evento.clientY - inicioY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    ir(dx < 0 ? siguiente : anterior);
  }

  function alTeclear(evento: KeyboardEvent) {
    if (evento.key === 'ArrowRight') ir(siguiente);
    else if (evento.key === 'ArrowLeft') ir(anterior);
    else if (evento.key === 'Escape') location.hash = '#galeria';
  }
</script>

<svelte:window onkeydown={alTeclear} />

<main class="pantalla">
  <header class="barra">
    <a href="#galeria" class="cerrar" aria-label="Cerrar y volver a la galería"><Icono nombre="cerrar" /></a>
    {#if foto}<p aria-live="polite">{indice + 1} de {lista.length}</p>{/if}
    <span class="espacio"></span>
  </header>

  {#if foto}
    <div
      class="foto"
      role="group"
      aria-roledescription="visor"
      aria-label="Desliza para pasar de foto"
      onpointerdown={alTocar}
      onpointerup={alSoltar}
      onpointercancel={() => (deslizando = false)}
    >
      {#key foto.id}
        {#if foto.tipo === 'video'}
          <!-- svelte-ignore a11y_media_has_caption -->
          <video src={foto.url} poster={foto.mini ?? undefined} controls playsinline preload="metadata"></video>
        {:else}
          <img
            src={foto.url}
            alt={foto.autor ? `Foto de ${foto.autor}` : 'Foto de la fiesta'}
            width={foto.ancho ?? undefined}
            height={foto.alto ?? undefined}
            style:background-image={foto.mini ? `url("${foto.mini}")` : undefined}
            draggable="false"
          />
        {/if}
      {/key}
    </div>

    <section class="datos">
      {#if foto.autor}<p class="autor">Subida por <span>{foto.autor}</span></p>{/if}
      <p class="detalle">{detalle}</p>
    </section>

    <div class="acciones">
      <div class="pasar">
        <Boton variante="sombra" icono="atras" onclick={() => ir(anterior)} deshabilitado={!anterior}>Anterior</Boton>
        <Boton variante="sombra" icono="siguiente" iconoDespues onclick={() => ir(siguiente)} deshabilitado={!siguiente}>
          Siguiente
        </Boton>
      </div>
      <Boton variante="claro" icono="descargar" href={foto.descarga} descargar>Descargar</Boton>
    </div>
  {:else}
    <div class="ausente" role="status">
      {#if galeria.estado === 'cargando'}
        <p>Abriendo la foto…</p>
      {:else}
        <p>Esta foto ya no está en la galería.</p>
        <Boton variante="claro" icono="galeria" href="#galeria">Ver la galería</Boton>
      {/if}
    </div>
  {/if}
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
    display: grid;
    place-items: center;
    min-height: 40dvh;
    padding: var(--e-4) 0;
    /* El navegador sigue haciendo zoom con dos dedos; el deslizar de lado lo maneja el visor. */
    touch-action: pan-y pinch-zoom;
    user-select: none;
  }

  .foto img,
  .foto video {
    display: block;
    width: 100%;
    height: auto;
    max-height: 50dvh;
    object-fit: contain;
  }

  /* Mientras llega la foto grande, se ve la miniatura estirada debajo. */
  .foto img {
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .ausente {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    gap: var(--e-5);
    padding: 0 var(--margen);
    color: var(--noche-texto-suave);
    font-family: var(--font-serif);
    font-size: var(--t-serif);
    text-align: center;
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
