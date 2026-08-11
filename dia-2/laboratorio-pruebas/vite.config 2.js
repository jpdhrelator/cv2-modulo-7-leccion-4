import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  // El alias '@' apunta a src/. Vale para la app Y para los tests,
  // porque Vitest lee este mismo archivo. Con Jest habría que repetirlo.
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  test: {
    // Sin esto no hay document ni window: los componentes no se pueden montar.
    environment: 'jsdom',

    // Permite usar describe/it/expect sin importarlos en cada archivo,
    // igual que hace Jest. Aun así, en este material los importo siempre:
    // ver de dónde viene cada cosa vale más que ahorrar una línea.
    globals: true,

    // Código que corre UNA vez antes de toda la suite.
    setupFiles: ['./tests/setup.js'],

    include: ['tests/**/*.test.js','src/**/*.spec.js'],

    // Higiene automática entre tests. Se explica en detalle en el ejercicio 4.
    clearMocks: true,
    restoreMocks: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**']
    }
  }

})
