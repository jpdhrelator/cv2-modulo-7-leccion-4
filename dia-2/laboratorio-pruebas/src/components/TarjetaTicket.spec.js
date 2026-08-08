import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TarjetaTicket from './TarjetaTicket.vue'


function montarTarjeta(cambios={}) {
    return mount(TarjetaTicket, {
        props:{
            ticket:{
                id:7,
                titulo:'No carga el informe mensual',
                prioridad: 'alta',
                resuelto: false,
                ...cambios
            }
        }
    });
}

describe('TarjetaTicket',()=>{

    it('muestra el titulo que recibe el props',()=>{
        const componentMounted= montarTarjeta();
        const titulo = componentMounted.get('[data-test="titulo"]').text();
        expect(titulo).toBe('No carga el informe mensual');
    });


    it('muestra la prioridad y le pone la clases que corresponde',()=>{
        const componentMounted= montarTarjeta({ prioridad: 'critica'});
        const etiqueta= componentMounted.get('[data-test="prioridad"]');

        expect(etiqueta.text()).toBe('critica');
        expect(etiqueta.classes()).toContain('pri--critica')
    });

    it('Emite "resolver" con el id del ticket al hacer clic',async()=>{
        const componentMounted= montarTarjeta();
        const btnResolver= componentMounted.get('[data-test="resolver"]');
        await btnResolver.trigger('click');

          // emitted() devuelve un registro de TODOS los eventos emitidos:
        // { resolver: [ [7] ] }  →  un evento, cuyo primer argumento fue 7
        const emittedObj= componentMounted.emitted('resolver')
        expect(emittedObj).toHaveLength(1);
        expect(emittedObj[0]).toEqual([7]);
    });

    it('no permite resolver un ticket que ya esta resuelto',()=>{
        const componentMounted= montarTarjeta({ resuelto: true });

        const btnResolver= componentMounted.get('[data-test="resolver"]');
        const spanEstado= componentMounted.get('[data-test="estado"]');

        expect(btnResolver.attributes('disabled')).toBeDefined();
        expect(spanEstado.text()).toBe('Resuelto');

    });
    it('se actualiza cuando cambian las props desde el padre',async ()=>{
        const componentMounted= montarTarjeta();

        const spanEstado= componentMounted.get('[data-test="estado"]');
        expect(spanEstado.text()).toBe('Abierto');

        await componentMounted.setProps({
            ticket: { id:7,
                titulo:'No carga el informe mensual',
                prioridad: 'alta',
                resuelto: true }
        });

        const spanEstadoCambiado= componentMounted.get('[data-test="estado"]'); 
        expect(spanEstadoCambiado.text()).toBe('Resuelto');   

    });
});