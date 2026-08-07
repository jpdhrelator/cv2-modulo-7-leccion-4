// De menor a mayor urgencia. El orden del arreglo ES la escala.
export const PRIORIDADES = ['baja', 'media', 'alta', 'critica'];

export function calcularPrioridad({ minutosAbierto, clientePremium, servicioCaido }) {
  if (servicioCaido) return 'critica'
  if (clientePremium && minutosAbierto >= 60) return 'alta'
  if (minutosAbierto >= 240) return 'alta'
  if (minutosAbierto >= 60) return 'media'
  return 'baja'
}

export function ordenarPorPrioridad(tickets) {
  // Copiamos con [...] para NO mutar el arreglo que nos pasaron.
  // Una función que muta lo que recibe es una función difícil de testear.
  return [...tickets].sort(
    (a, b) => PRIORIDADES.indexOf(b.prioridad) - PRIORIDADES.indexOf(a.prioridad)
  )
}