<script lang="ts" module>
  // Íconos dibujados con un solo trazo de 1.75 px, en el color del texto.
  const trazos = {
    camara: [
      'M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.4-2h5l1.4 2h1.6A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z',
      'M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    ],
    galeria: ['M4 5h7v7H4z', 'M13 5h7v7h-7z', 'M4 14h7v5H4z', 'M13 14h7v5h-7z'],
    atras: ['M15 5l-7 7 7 7'],
    siguiente: ['M9 5l7 7-7 7'],
    cerrar: ['M6 6l12 12', 'M18 6L6 18'],
    descargar: ['M12 4v11', 'M7 10.5l5 5 5-5', 'M5 20h14'],
    mas: ['M12 5v14', 'M5 12h14'],
    senal: ['M4.5 10a11 11 0 0 1 15 0', 'M7.5 13.2a6.6 6.6 0 0 1 9 0', 'M11 16.5a1.6 1.6 0 0 1 2 0'],
    imagen: ['M4 6h16v12H4z', 'M4 15.5l4.5-4.5 4 4 2.5-2.5 5 5', 'M15.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'],
    play: ['M8 5.5v13l10-6.5z'],
  } as const;

  export type NombreIcono = keyof typeof trazos;
</script>

<script lang="ts">
  interface Props {
    nombre: NombreIcono;
    tamano?: number;
  }

  let { nombre, tamano = 22 }: Props = $props();
</script>

<svg
  width={tamano}
  height={tamano}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#each trazos[nombre] as d (d)}
    <path {d} fill={nombre === 'play' ? 'currentColor' : 'none'} />
  {/each}
</svg>
