import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FormularioLogin from './FormularioLogin.vue'
import { login } from '@/servicios/auth.js'

// ── MOCK 1: el servicio de autenticación ────────────────────────────
// El módulo completo se sustituye. `login` deja de existir tal como
// fue escrito y pasa a ser un doble que podemos programar e interrogar.
vi.mock('@/servicios/auth.js', () => ({
    login: vi.fn()
}));


// ── MOCK 2: el router ───────────────────────────────────────────────
// vi.hoisted es necesario porque vi.mock se SUBE al inicio del archivo
// (ver la sección siguiente). Sin esto: "Cannot access before initialization".
const empujar = vi.hoisted(() => vi.fn());

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: empujar }),
    useRoute: () => ({ params: {}, query: {} })
}))

beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
});

async function llenarYEnviar(componentMounted, correo, clave) {
    await componentMounted.get('[data-test="correo"]').setValue(correo)
    await componentMounted.get('[data-test="clave"]').setValue(clave)
    await componentMounted.get('form').trigger('submit')
    await flushPromises()   // deja que se resuelva la promesa de login()
}


describe('FormularioLogin', () => {
    it('invoca al servicio de autenticación con el usuario y la contraseña', async () => {
        login.mockResolvedValue('jwt-de-prueba');

        const componentMounted = mount(FormularioLogin);

        await llenarYEnviar(componentMounted, 'usuario1@misitio.com', '123password')


        expect(login).toHaveBeenCalledTimes(1);
        expect(login).toHaveBeenCalledWith('usuario1@misitio.com', '123password');
    });

    it('guarda el token y lleva al panel cuando las credenciales son válidas', async () => {
        login.mockResolvedValue('jwt-de-prueba')
        const componentMounted = mount(FormularioLogin)

        await llenarYEnviar(componentMounted, 'usuario1@misitio.com', '123password')

        expect(localStorage.getItem('token')).toBe('jwt-de-prueba')
        expect(empujar).toHaveBeenCalledWith('/panel')
    })

    it('muestra un mensaje humano y no navega cuando el servidor rechaza', async () => {
        login.mockRejectedValue(new Error('Request failed with status code 401'))

        const componentMounted = mount(FormularioLogin)

        await llenarYEnviar(componentMounted, 'usuario1@misitio.com', 'clave-mala')

        const aviso = componentMounted.get('[data-test="error"]')
        expect(aviso.text()).toContain('No pudimos validar tus credenciales')
        // El usuario NUNCA debe ver "401" ni "Request failed"
        expect(aviso.text()).not.toContain('401')

        expect(empujar).not.toHaveBeenCalled()
        expect(localStorage.getItem('token')).toBeNull()
    })


    it('bloquea el botón mientras la petición está en curso', async () => {
        // Una promesa que nunca se resuelve: congela el componente
        // en el estado "enviando" para poder mirarlo con calma.
        login.mockReturnValue(new Promise(() => { }))
        const componentMounted = mount(FormularioLogin)

        await componentMounted.get('form').trigger('submit')

        const boton = componentMounted.get('[data-test="entrar"]')
        expect(boton.attributes('disabled')).toBeDefined()
        expect(boton.text()).toBe('Entrando…')
    })
});