<script lang="ts">
  import Inicio from './pantallas/Inicio.svelte';
  import Subiendo from './pantallas/Subiendo.svelte';
  import Listo from './pantallas/Listo.svelte';
  import Galeria from './pantallas/Galeria.svelte';
  import FotoAbierta from './pantallas/FotoAbierta.svelte';
  import { leerRuta } from './lib/rutas';

  let ruta = $state(leerRuta());

  const pantallas = { inicio: Inicio, subiendo: Subiendo, listo: Listo, galeria: Galeria, foto: FotoAbierta };

  let Pantalla = $derived(pantallas[ruta]);

  function alCambiarHash() {
    ruta = leerRuta();
    window.scrollTo(0, 0);
  }
</script>

<svelte:window onhashchange={alCambiarHash} />

<Pantalla />
