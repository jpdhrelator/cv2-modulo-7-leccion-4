import { ref } from 'vue'

// La sesión vive en localStorage para que sobreviva a un F5.
// Detalle importante para hoy: cy.session() sabe guardar y restaurar
// exactamente esto, y por eso podremos saltarnos el login por interfaz.
export const usuario = ref(JSON.parse(localStorage.getItem('sesion') || 'null'))

export function guardarSesion(datos) {
  usuario.value = datos
  localStorage.setItem('sesion', JSON.stringify(datos))
}

export function cerrarSesion() {
  usuario.value = null
  localStorage.removeItem('sesion')
}