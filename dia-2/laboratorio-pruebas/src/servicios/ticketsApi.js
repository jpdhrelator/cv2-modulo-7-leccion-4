import axios from 'axios';

const http = axios.create({ baseURL:'http://localhost:3001'});

export async function obtenerTickets(estado = 'abierto') {
  const { data } = await http.get('/tickets', { params: { estado } })
  return data
}

export async function resolverTicket(id) {
  const { data } = await http.patch(`/tickets/${id}`, { resuelto: true })
  return data
}