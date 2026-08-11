// UNA sola puerta de salida al backend. Que todo pase por acá es lo
// que después hace trivial interceptar la red desde un test.
const BASE = '/api'

export async function iniciarSesion(email, clave) {
  const respuesta = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, clave })
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.mensaje || 'No pudimos iniciar sesion')
  return datos
}

export async function obtenerTickets() {
  const respuesta = await fetch(`${BASE}/tickets`)
  if (!respuesta.ok) throw new Error('No pudimos cargar la cola')
  return respuesta.json()
}

export async function resolverTicket(id) {
  const respuesta = await fetch(`${BASE}/tickets/${id}/resolver`, { method: 'POST' })
  if (!respuesta.ok) throw new Error('No pudimos resolver el ticket')
  return respuesta.json()
}