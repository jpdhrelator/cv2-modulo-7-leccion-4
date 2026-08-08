import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ListaDeTickets from './ListaDeTickets.vue'
import { auditoria } from '@/servicios/auditoria.js'

const TICKETS = [
    { id: 3, titulo: 'Impresora sin tóner', prioridad: 'media', resuelto: false }
]


describe('', () => {
    it('registra en auditoria cuando se resuelve un ticket', async () => {

        const espia = vi.spyOn(auditoria, 'registrar');

        const componentMounted = mount(ListaDeTickets, {
            props: { tickets: TICKETS }
        });

        const botonResolver = componentMounted.get('[data-test="resolver"]');
        await botonResolver.trigger('click');

        expect(espia).toHaveBeenCalled();
        expect(espia).toHaveBeenCalledTimes(1);
        expect(espia).toHaveBeenCalledWith('ticket_resuelto', { id: 3 });


    });


    it('no registre nada si nadie hace clic', () => {
        const espia = vi.spyOn(auditoria, 'registrar');
        const componentMounted = mount(ListaDeTickets, {
            props: { tickets: TICKETS }
        });
        expect(espia).not.toHaveBeenCalled();
    });
    /*
        it('avisa al padre a través del callback que le pasaron',async()=>{
    
            const alResolver= vi.fn();
            const componentMounted= mount(ListaDeTickets, {
                props: { tickets: TICKETS, alResolver }
            });
            const botonResolver= componentMounted.get('[data-test="resolver"]');
            await botonResolver.trigger('click');
            expect(alResolver).toHaveBeenCalledWith(3);
        });
    */

    it('permite revisar el registro de llamadas en detalle', async () => {
        const espia = vi.spyOn(auditoria, 'registrar');
        const componentMounted = mount(ListaDeTickets, {
            props: { tickets: TICKETS }
        });
        const botonResolver = componentMounted.get('[data-test="resolver"]');
        await botonResolver.trigger('click');

        // mock.calls es un arreglo de arreglos: una entrada por llamada,
        // y dentro, los argumentos de esa llamada.
        expect(espia.mock.calls).toEqual([  ['ticket_resuelto', { id: 3 }]  ])

        // Útil cuando solo te interesa una parte del argumento
        expect(espia.mock.calls[0][1].id).toBe(3)

        // La última llamada, sin contar cuántas hubo
        expect(espia.mock.lastCall).toEqual(['ticket_resuelto', { id: 3 }])

        // Qué devolvió: { type: 'return', value: undefined }
        expect(espia.mock.results[0].type).toBe('return')
    });


    
});