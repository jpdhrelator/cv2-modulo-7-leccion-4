<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerTickets, resolverTicket } from '../servicios/api.js'
import { cerrarSesion, usuario } from '../sesion.js'

const tickets = ref([])
const cargando = ref(false)
const error = ref('')
const filtro = ref('')
const router = useRouter()

const visibles = computed(() =>
  tickets.value.filter((t) =>
    t.titulo.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    tickets.value = await obtenerTickets()
  } catch {
    error.value = 'No pudimos cargar la cola. Intenta nuevamente.'
  } finally {
    cargando.value = false
  }
}

async function resolver(id) {
  await resolverTicket(id)
  tickets.value = tickets.value.filter((t) => t.id !== id)
}

function salir() {
  cerrarSesion()
  router.push('/login')
}

onMounted(cargar)
</script>

<template>
  <main class="cola">
    <header>
      <h1>Cola de tickets</h1>
      <p data-cy="usuario">{{ usuario?.nombre }}</p>
      <button data-cy="salir" type="button" @click="salir">Salir</button>
    </header>

    <label for="filtro">Buscar</label>
    <input id="filtro" data-cy="filtro" v-model="filtro" type="search" placeholder="Buscar en la cola">

    <p v-if="cargando" data-cy="cargando">Cargando la cola…</p>

    <div v-else-if="error" data-cy="error-cola" role="alert">
      <p>{{ error }}</p>
      <button data-cy="reintentar" type="button" @click="cargar">Reintentar</button>
    </div>

    <p v-else-if="visibles.length === 0" data-cy="vacio">No hay tickets que mostrar.</p>

    <ul v-else data-cy="lista">
      <li v-for="t in visibles" :key="t.id" data-cy="ticket" :data-id="t.id">
        <span data-cy="titulo">{{ t.titulo }}</span>
        <span data-cy="prioridad">{{ t.prioridad }}</span>
        <button data-cy="resolver" type="button" @click="resolver(t.id)">Resolver</button>
      </li>
    </ul>
  </main>
</template>