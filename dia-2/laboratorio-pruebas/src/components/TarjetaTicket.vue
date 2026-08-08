<script setup>
import { computed } from 'vue'

const props = defineProps({
  ticket: { type: Object, required: true }
})

const emit = defineEmits(['resolver'])

const etiquetaEstado = computed(() => props.ticket.resuelto ? 'Resuelto' : 'Abierto')
</script>

<template>
  <article class="tarjeta" :data-test="`ticket-${ticket.id}`">
    <h3 data-test="titulo">{{ ticket.titulo }}</h3>

    <span data-test="prioridad" :class="`pri pri--${ticket.prioridad}`">
      {{ ticket.prioridad }}
    </span>

    <span data-test="estado">{{ etiquetaEstado }}</span>

    <button
      data-test="resolver"
      type="button"
      :disabled="ticket.resuelto"
      :aria-label="`Marcar como resuelto el ticket ${ticket.id}`"
      @click="emit('resolver', ticket.id)"
    >
      Marcar como resuelto
    </button>
  </article>
</template>