<script setup>
import { auditoria } from '@/servicios/auditoria.js'
import TarjetaTicket from './TarjetaTicket.vue'

defineProps({
  tickets: { type: Array, default: () => [] }
})

const emit = defineEmits(['resolver'])

function alResolver(id) {
  // Efecto colateral invisible: no cambia NADA en pantalla.
  // Sin un espía, no hay forma de comprobar que ocurrió.
  auditoria.registrar('ticket_resuelto', { id })
  emit('resolver', id)
}
</script>
<template>
  <section class="lista">
    <!-- Estado vacío: nunca dejes una lista vacía sin explicación -->
    <p v-if="!tickets.length" data-test="vacio">
      No hay tickets en la cola. Buen trabajo.
    </p>

    <TarjetaTicket
      v-for="ticket in tickets"
      :key="ticket.id"
      :ticket="ticket"
      @resolver="alResolver"
    />
  </section>
</template>
