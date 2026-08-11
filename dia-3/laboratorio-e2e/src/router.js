import { createRouter, createWebHistory } from 'vue-router'
import VistaLogin from '@/views/VistaLogin.vue'
import VistaCola from '@/views/VistaCola.vue'
import { usuario } from '@/sesion.js'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',      redirect: '/cola' },
    { path: '/login', name: 'login', component: VistaLogin },
    { path: '/cola',  name: 'cola',  component: VistaCola, meta: { privada: true } }
  ]
})

// Guardia de navegación: /cola exige sesión. Éste es justamente el
// tipo de regla que una prueba unitaria no alcanza a ver.
router.beforeEach((destino) => {
  if (destino.meta.privada && !usuario.value) return { name: 'login' }
})