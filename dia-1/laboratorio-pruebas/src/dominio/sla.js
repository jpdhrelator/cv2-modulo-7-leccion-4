const SLA_EN_MINUTOS = {
    critica: 15,
    alta: 60,
    media:  240,
    baja:  1440
};
const MS_POR_MINUTO = 60000;

function minutosEntre(desde,hasta) {
    return (hasta - desde)/ MS_POR_MINUTO;
}

export function minutosRestantesDeSla(ticket, ahora){
    const limite = SLA_EN_MINUTOS[ticket.prioridad];

    if(limite === undefined){
        throw new Error(`Prioridad desconocida: ${ticket.prioridad}`);        
    }

    const transcurridos = minutosEntre(ticket.abiertoEn, ahora)

    return limite - transcurridos;
}