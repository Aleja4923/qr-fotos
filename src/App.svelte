<script lang="ts">
  import Inicio from './pantallas/Inicio.svelte';
  import Subiendo from './pantallas/Subiendo.svelte';
  import Listo from './pantallas/Listo.svelte';
  import Galeria from './pantallas/Galeria.svelte';
  import FotoAbierta from './pantallas/FotoAbierta.svelte';
  import { galeria } from './lib/galeria.svelte';
  import { leerRuta } from './lib/rutas';
  import { subidas } from './lib/subidas.svelte';

  let ruta = $state(leerRuta());

  // La cuenta de perlas del corazón se necesita desde la primera pantalla.
  galeria.actualizar();

  function alCambiarHash() {
    const anterior = ruta.pantalla;
    ruta = leerRuta();
    // Pasar de una foto a otra en el visor no mueve la página.
    if (!(anterior === 'foto' && ruta.pantalla === 'foto')) window.scrollTo(0, 0);
  }

  // Mientras haya subidas: pantalla encendida y aviso si intenta cerrar la página.
  $effect(() => {
    if (!subidas.ocupado || !('wakeLock' in navigator)) return;
    let candado: WakeLockSentinel | null = null;
    let activo = true;

    async function pedir() {
      try {
        const nuevo = await navigator.wakeLock.request('screen');
        if (activo) candado = nuevo;
        else nuevo.release();
      } catch {
        // Batería baja o navegador sin permiso: el aviso en pantalla cubre el resto.
      }
    }

    // El candado se pierde al cambiar de app; se vuelve a pedir al regresar.
    function alVolver() {
      if (document.visibilityState === 'visible') pedir();
    }

    pedir();
    document.addEventListener('visibilitychange', alVolver);
    return () => {
      activo = false;
      document.removeEventListener('visibilitychange', alVolver);
      candado?.release();
    };
  });

  function antesDeCerrar(evento: BeforeUnloadEvent) {
    if (subidas.ocupado) evento.preventDefault();
  }
</script>

<svelte:window onhashchange={alCambiarHash} onbeforeunload={antesDeCerrar} />

{#if ruta.pantalla === 'inicio'}
  <Inicio />
{:else if ruta.pantalla === 'subiendo'}
  <Subiendo />
{:else if ruta.pantalla === 'listo'}
  <Listo />
{:else if ruta.pantalla === 'galeria'}
  <Galeria />
{:else}
  <FotoAbierta id={ruta.id} />
{/if}
