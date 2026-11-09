<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icono, { type NombreIcono } from './Icono.svelte';

  interface Props {
    /** primario: tinta café. marco: doble filete rosado. claro: papel sobre la noche del visor. sombra: discreto sobre la noche. */
    variante?: 'primario' | 'marco' | 'claro' | 'sombra';
    icono?: NombreIcono;
    /** Pone el ícono después del texto (por ejemplo, la flecha de "Siguiente"). */
    iconoDespues?: boolean;
    href?: string;
    /** Con href: descarga el enlace en vez de abrirlo. */
    descargar?: boolean;
    onclick?: () => void;
    deshabilitado?: boolean;
    /**
     * Convierte el botón en el selector de fotos y videos del celular. Sin `capture`
     * (dejaría solo la cámara) y sin image/heic (Safari pasaría los JPG a HEIC).
     */
    onarchivos?: (archivos: File[]) => void;
    children: Snippet;
  }

  let {
    variante = 'primario',
    icono,
    iconoDespues = false,
    href,
    descargar = false,
    onclick,
    deshabilitado = false,
    onarchivos,
    children,
  }: Props = $props();

  function alElegir(evento: Event & { currentTarget: HTMLInputElement }) {
    const entrada = evento.currentTarget;
    const archivos = [...(entrada.files ?? [])];
    // Se limpia para poder elegir las mismas fotos otra vez si hace falta.
    entrada.value = '';
    if (archivos.length) onarchivos?.(archivos);
  }
</script>

{#snippet contenido()}
  {#if icono && !iconoDespues}<Icono nombre={icono} />{/if}
  <span>{@render children()}</span>
  {#if icono && iconoDespues}<Icono nombre={icono} />{/if}
{/snippet}

{#if onarchivos}
  <label class={['boton', 'selector', variante]}>
    <input type="file" accept="image/*,video/*" multiple onchange={alElegir} />
    {@render contenido()}
  </label>
{:else if href}
  <a class={['boton', variante]} {href} download={descargar ? '' : undefined}>{@render contenido()}</a>
{:else}
  <button type="button" class={['boton', variante]} {onclick} disabled={deshabilitado}>{@render contenido()}</button>
{/if}

<style>
  .boton {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    min-height: var(--boton-alto);
    padding: 0 var(--e-5);
    border: 0;
    border-radius: var(--r-redondo);
    font-family: var(--font-ui);
    font-size: var(--t-boton);
    font-weight: 500;
    letter-spacing: 0.2px;
    line-height: 1.2;
    text-align: center;
    cursor: pointer;
    transition:
      transform 160ms var(--salida),
      box-shadow 160ms var(--salida);
  }

  .boton:active {
    transform: scale(0.97);
  }

  .boton:disabled {
    opacity: 0.4;
    cursor: default;
    transform: none;
  }

  /* La entrada queda invisible pero enfocable; el foco se dibuja en el botón. */
  .selector input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .selector:focus-within {
    outline: 2px solid var(--foco, var(--tinta));
    outline-offset: 3px;
  }

  .primario {
    background: var(--tinta);
    color: var(--papel);
    box-shadow: var(--sombra-boton);
  }

  .primario:active {
    box-shadow: var(--sombra-boton-pulsado);
  }

  /* Doble filete, como el marco de las tarjetas de puesto. */
  .marco {
    background: transparent;
    color: var(--tinta);
    border: 1px solid var(--rosa);
    outline: 1px solid var(--rosa);
    outline-offset: -5px;
  }

  .marco:focus-visible {
    outline: 2px solid var(--tinta);
    outline-offset: 3px;
  }

  .claro {
    background: var(--papel);
    color: var(--tinta);
  }

  .sombra {
    background: var(--noche-alta);
    color: var(--papel);
  }

  @media (prefers-reduced-motion: reduce) {
    .boton {
      transition: none;
    }
  }
</style>
