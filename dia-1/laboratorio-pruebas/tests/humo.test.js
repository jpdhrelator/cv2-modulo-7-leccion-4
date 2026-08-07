import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils'

describe('el entorno de pruebas', () => {

    it('ejecuta aserciones', () => {
        expect(1 + 1).toBe(2);
    });

    it('tiene un DOM disponible', () => {
        // Si jsdom no estuviera configurado, `document` sería undefined
        expect(typeof document).toBe('object')
    });

    it('puede montar un componente de Vue', () => {
        const Saludo = { template: '<p>hola</p>' }
        const wrapper = mount(Saludo)
        expect(wrapper.text()).toBe('hola');
    })
});