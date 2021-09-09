export const obtenerMes = (mes) => {
    switch (mes) {
        case '01':
            return 'Enero'
        case '02':
            return 'Febrero';
        case '03':
            return 'Marzo';
        case '04':
            return 'Abril';
        case '05':
            return 'Mayo';
        case '06':
            return 'Junio';
        case '07':
            return 'Julio';
        case '08':
            return 'Agosto';
        case '09':
            return 'Septiembre';
        case '10':
            return 'Octubre';
        case '11':
            return 'Noviembre';
        case '12':
            return 'Diciembre';
        default:
            return 'Indefinido';
    }
}

export const obtenerMesNumero = (mes) => {
    const pad = '00';
    let mesNumero = (mes + 1).toString();
    if (mesNumero.length === 1) {
        mesNumero = pad.substring(0, pad.length - mesNumero.length) + mesNumero;
    }
    return mesNumero;
}

export const obtenerEtiquetas = () => {
    let labels = [];
    for (let i = 1; i <= 12; i++) {
        labels.push(obtenerMes(i.toString().padStart(2,'0')));
    }
    return labels;
}