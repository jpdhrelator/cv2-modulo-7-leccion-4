import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// ── API DE CLASE ──────────────────────────────────────────────────
// Un backend en memoria para que la app tenga datos reales al correr
// `npm run dev`. En un proyecto de verdad esto sería otro servicio;
// acá nos ahorra levantar un segundo proceso.
const SEMILLA = () => ([
  { id: 'T-101', titulo: 'No puedo iniciar sesion',  prioridad: 'alta',    minutosAbierto: 320 },
  { id: 'T-102', titulo: 'La boleta llega sin IVA',  prioridad: 'media',   minutosAbierto: 95  },
  { id: 'T-103', titulo: 'Caida total del portal',   prioridad: 'critica', minutosAbierto: 12  }
])

function apiDeClase() {
  let tickets = SEMILLA()

  const leerCuerpo = (req) => new Promise((listo) => {
    let crudo = ''
    req.on('data', (trozo) => { crudo += trozo })
    req.on('end', () => listo(crudo ? JSON.parse(crudo) : {}))
  })

  return {
    name: 'api-de-clase',
    configureServer(server) {
      // Al montar el middleware en '/api', el prefijo se recorta:
      // /api/tickets llega acá como /tickets.
      server.middlewares.use('/api', async (req, res, next) => {
        const ruta = req.url.split('?')[0]
        res.setHeader('Content-Type', 'application/json')

        if (req.method === 'POST' && ruta === '/login') {
          const { email, clave } = await leerCuerpo(req)
          const ok = email === 'soporte@demo.cl' && clave === 'clave123'
          res.statusCode = ok ? 200 : 401
          return res.end(JSON.stringify(
            ok ? { token: 'token-de-clase', nombre: 'Equipo Soporte' }
               : { mensaje: 'Correo o clave incorrectos' }
          ))
        }

        if (req.method === 'GET' && ruta === '/tickets') {
          return res.end(JSON.stringify(tickets))
        }

        if (req.method === 'POST' && /^\/tickets\/[^/]+\/resolver$/.test(ruta)) {
          const id = ruta.split('/')[2]
          tickets = tickets.filter((t) => t.id !== id)
          return res.end(JSON.stringify({ ok: true }))
        }

        // Deja los datos como recién instalados. Los tests lo llaman
        // antes de cada escenario para no depender del anterior.
        if (req.method === 'POST' && ruta === '/reset') {
          tickets = SEMILLA()
          return res.end(JSON.stringify({ ok: true }))
        }

        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), apiDeClase()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  // Puerto fijo: si Vite se cambia solo al 5174, la baseUrl de Cypress
  // deja de apuntar a ninguna parte y todos los tests fallan igual.
  server: { port: 5173, strictPort: true }
})

