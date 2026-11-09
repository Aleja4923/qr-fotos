import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { r2Simulado } from './dev/r2-simulado.ts'

// https://vite.dev/config/
export default defineConfig({
  // r2Simulado solo corre en `npm run dev`; se reemplaza por el Worker real más adelante.
  plugins: [svelte(), r2Simulado()],
})
