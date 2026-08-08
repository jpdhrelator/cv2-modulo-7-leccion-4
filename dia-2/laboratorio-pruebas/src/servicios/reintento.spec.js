import { describe, it, expect, vi } from 'vitest';


// La unidad bajo prueba: reintenta una vez si la primera llamada falla.
async function cargarConReintento(consultar) {
  try {
    return await consultar()
  } catch {
    return await consultar()
  }
}


describe('cargarConReintento', ()=>{

    it('reintenta una vez cuando la primera llamada falla',async()=>{
        const consultarStub = vi.fn()
        .mockRejectedValueOnce(new Error('503 Service Unavailble'))
        .mockResolvedValueOnce([{id:1, titulo: 'Impresora'}]);

        const resultado= await cargarConReintento(consultarStub);

        expect(consultarStub).toHaveBeenCalledTimes(2);
        expect(resultado).toEqual([{id:1, titulo: 'Impresora'}]);
    });

    it('propaga el error si el reintento también falla',async()=>{
        const consultar = vi.fn().mockRejectedValue(new Error('503'));

        await expect(cargarConReintento(consultar)).rejects.toThrow('503')
        expect(consultar).toHaveBeenCalledTimes(2)

    })
});