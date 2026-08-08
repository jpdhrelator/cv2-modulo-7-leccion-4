<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/servicios/auth.js'

const correo = ref('')
const clave = ref('')
const error = ref('')
const enviando = ref(false)

const router = useRouter()

async function enviar() {
  error.value = ''
  enviando.value = true
  try {
    const token = await login(correo.value, clave.value)
    localStorage.setItem('token', token)
    router.push('/panel')
  } catch {
    // Mensaje humano, nunca el código de error del servidor
    error.value = 'No pudimos validar tus credenciales. Revisa el correo y la contraseña.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <form @submit.prevent="enviar">
    <label for="correo">Correo</label>
    <input id="correo" data-test="correo" v-model="correo" type="email" required>

    <label for="clave">Contraseña</label>
    <input id="clave" data-test="clave" v-model="clave" type="password" required>

    <button data-test="entrar" type="submit" :disabled="enviando">
      {{ enviando ? 'Entrando…' : 'Entrar' }}
    </button>

    <p v-if="error" data-test="error" role="alert">{{ error }}</p>
  </form>
</template>