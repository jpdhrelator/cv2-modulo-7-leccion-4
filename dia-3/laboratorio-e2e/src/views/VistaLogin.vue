<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { iniciarSesion } from '../servicios/api.js'
import { guardarSesion } from '../sesion.js'

const email = ref('')
const clave = ref('')
const error = ref('')
const enviando = ref(false)
const router = useRouter()

async function enviar() {
  error.value = ''
  enviando.value = true
  try {
    guardarSesion(await iniciarSesion(email.value, clave.value))
    router.push('/cola')
  } catch (e) {
    error.value = e.message
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <main class="caja">
    <h1>Mesa de soporte</h1>

    <form data-cy="form-login" @submit.prevent="enviar">
      <label for="email">Correo</label>
      <input id="email" data-cy="email" v-model="email" type="email" required>

      <label for="clave">Clave</label>
      <input id="clave" data-cy="clave" v-model="clave" type="password" required>

      <button data-cy="entrar" type="submit" :disabled="enviando">
        {{ enviando ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>

    <p v-if="error" data-cy="error-login" role="alert">{{ error }}</p>
  </main>
</template>