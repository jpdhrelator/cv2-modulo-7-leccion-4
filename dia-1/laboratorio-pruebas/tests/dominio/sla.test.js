import { describe, it, expect } from 'vitest';
import { minutosRestantesDeSla } from '@/dominio/sla.js';


describe('minutosRestantesDeSla',()=>{
    it(' a un ticket de prioridad alta recien abierto le quedan 60 minutos',()=>{
        const abiertoEn = new Date('2026-03-10T10:00:00Z');
        const ahora     = new Date('2026-03-10T10:00:00Z');

        const restantes= minutosRestantesDeSla({ prioridad: 'alta' , abiertoEn},ahora);

        expect(restantes).toBe(60);
    }); 
    it('devuelve negativo cuando el plazo ya se vencio',()=>{
        const abiertoEn = new Date('2026-03-10T10:00:00Z');
        const ahora     = new Date('2026-03-10T11:30:00Z');

        const restantes= minutosRestantesDeSla({ prioridad: 'alta' , abiertoEn},ahora);

        expect(restantes).toBe(-30);
    });
     
    it('respeta el plazo largo de las prioridades bajas',()=>{
        const abiertoEn = new Date('2026-03-10T10:00:00Z');
        const ahora     = new Date('2026-03-10T22:00:00Z');

        const restantes= minutosRestantesDeSla({ prioridad: 'baja' , abiertoEn},ahora);

        expect(restantes).toBe(720);
    });

    it('lanza un error si la prioridad no esta en la escala',()=>{
        const abiertoEn = new Date('2026-03-10T10:00:00Z');
        const ahora= new Date();
        const ticket= { prioridad: 'urgentisima',abiertoEn }

        expect(()=>minutosRestantesDeSla(ticket,ahora)).toThrow('Prioridad desconocida: urgentisima');
    });
});