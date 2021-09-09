import { obtenerMes } from "./meses";

export const obtenerValorEstado = (valor) => {
    let estado = '';
    switch (valor) {
        case 'PPR':
            estado = 'POR PROCESAR'
            break;
        case 'AUT':
            estado = 'AUTORIZADO'
            break;
        case 'NAT':
            estado = 'NO AUTORIZADO'
            break;
        case 'REC':
            estado = 'RECIBIDA'
            break;
        case 'EMA':
            estado = 'PROCESADA'
            break;
        case 'DEV':
            estado = 'DEVUELTA'
            break;
        case 'ANU':
            estado = 'ANULADA'
            break;
        default:
            break;
    }
    return estado;
}

export const obtenerFecha = (fecha) => {
    const division = fecha.split('/');
    
    return `${obtenerMes(division[1])} ${division[0]}, ${division[2]}`;
}

export const cambiarFecha = (fecha, incluirHora = false) => {
    const auxiliar = fecha.split('T');
    const division = auxiliar[0].split('-');
    const hora = auxiliar[1].split(':');
    if (incluirHora) {
        return `${obtenerMes(division[1])} ${division[2]}, ${division[0]}, ${hora[0]}:${hora[1]}`
    } else {
        return `${obtenerMes(division[1])} ${division[2]}, ${division[0]}`
    }
}