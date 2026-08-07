import { describe, it, expect } from 'vitest';
import { calcularPrioridad, ordenarPorPrioridad } from '@/dominio/prioridad.js';

describe('prioridad.js', () => {
    describe('calcularPrioridad', () => {
        it('marca como critica cualquier caída de servicio, aunque sl ticket sea nuevo', () => {
            // Arrange — preparo la entrada
            const ticket = {
                minutosAbierto: 1,
                clientePremium: false,
                servicioCaido: true
            };

            // Act — ejecuto la unidad, una sola vez
            const prioridad = calcularPrioridad(ticket);


            // Assert — comparo con lo que el negocio dice que debe pasar
            expect(prioridad).toBe('critica');
        });

        it('sube a alta un ticket de cliente premiun que lleva una hora abierto', () => {
            const ticket = {
                minutosAbierto: 60,
                clientePremium: true,
                servicioCaido: false
            };
            const prioridad = calcularPrioridad(ticket);
            expect(prioridad).toBe('alta');
        });

        it('deja en media al cliente normal con una hora abierta', () => {
            const ticket = { minutosAbierto: 60, clientePremium: false, servicioCaido: false }
            const prioridad = calcularPrioridad(ticket);
            expect(prioridad).toBe('media')
        });

        it('parte en baja cuando el ticket recién se abrió', () => {
            const ticket = { minutosAbierto: 0, clientePremium: true, servicioCaido: false }
            const prioridad = calcularPrioridad(ticket);
            expect(prioridad).toBe('baja')
        })


    });



    describe('ordenarPorPrioridad', () => {

        // beforeEach corre ANTES de cada it. Cada test arranca con datos nuevos:
        // es lo que garantiza el aislamiento.
        let cola

        beforeEach(() => {
            cola = [
                { id: 1, prioridad: 'baja' },
                { id: 2, prioridad: 'critica' },
                { id: 3, prioridad: 'media' }
            ]
        })

        it('pone primero el ticket más urgente', () => {
            const resultId = ordenarPorPrioridad(cola)[0].id;
            expect(resultId).toBe(2)
        })

        it('no modifica el arreglo original', () => {
            ordenarPorPrioridad(cola)
            const result = cola.map(t => t.id)
            // Si la función mutara la entrada, este test la delataría
            expect(result).toEqual([1, 2, 3])
        })

        it('devuelve un arreglo vacío si la cola está vacía', () => {
            const result = ordenarPorPrioridad([]);
            expect(result).toEqual([])
        })
    })


    describe('calcularPrioridad — tabla completa de la regla', () => {
        it.each([
             // minutos | premium | caído  | esperado
            [   0,       false,    false,   'baja'    ],
            [  59,       true,     false,   'baja'    ],
            [  60,       false,    false,   'media'   ],
            [  60,       true,     false,   'alta'    ],
            [ 239,       false,    false,   'media'   ],
            [ 240,       false,    false,   'alta'    ],
            [   1,       false,    true,    'critica' ],
            [ 999,       true,     true,    'critica' ]
        ])('con %i minutos, premium=%s y caído=%s devuelve "%s"',
            (minutosAbierto, clientePremium, servicioCaido, esperado) => {
                const resul=calcularPrioridad({ minutosAbierto, clientePremium, servicioCaido });
                expect(resul).toBe(esperado)
            }
        )
    })
});
