<script setup>
import TarjetaTicket from './components/TarjetaTicket.vue';

const ticket={
                id:7,
                titulo:'No carga el informe mensual',
                prioridad: 'alta',
                resuelto: false,
            }
</script>

<template>
  <TarjetaTicket :ticket="ticket"/>
</template>
