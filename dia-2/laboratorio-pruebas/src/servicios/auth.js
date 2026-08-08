import axios from 'axios'

export async function login(correo, clave) {
  const { data } = await axios.post('/auth/login', { correo, clave })
  return data.token
}