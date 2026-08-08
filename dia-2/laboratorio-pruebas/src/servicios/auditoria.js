export const auditoria= {
    registrar(evento, datos){
        console.info('[Auditoría]',evento,datos, new Date().toISOString());
    }
}