import { config } from '@vue/test-utils'
import { afterEach, vi } from 'vitest'

// Configuración GLOBAL de Vue Test Utils: lo que pongas acá lo reciben
// todos los mount() de la suite, sin repetir `global: { ... }` en cada uno.
config.global.stubs = {
  // Los enlaces del router no son parte de ninguna unidad que probemos hoy.
  RouterLink: true
}

// Después de CADA test dejamos el mundo como lo encontramos.
// Un test que ensucia el entorno hace fallar al siguiente, y el siguiente
// es inocente: vas a perder media hora buscando el error donde no está.
afterEach(() => {
  vi.useRealTimers()      // por si alguien congeló el reloj
  vi.unstubAllGlobals()   // por si alguien reemplazó fetch o similar
  localStorage.clear()
  document.body.innerHTML = ''
})