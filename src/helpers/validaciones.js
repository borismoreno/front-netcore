export const validarCedula = (cedula) => {
    let total = 0;
    const longitud = cedula.length;
    const longcheck = longitud - 1;

    if (cedula !== "" && longitud === 10){
        for (let i = 0; i < longcheck; i++) {
            if (i%2 === 0) {
                let aux = cedula.charAt(i) * 2;
                if (aux > 9) aux -= 9;
                total += aux;
            } else {
                total += parseInt(cedula.charAt(i)); // parseInt o concatenará en lugar de sumar
            }
            
        }

        total = total % 10 ? 10 - total % 10 : 0;

        if (cedula.charAt(longitud-1) === total.toString()) {
            return true;
        }else{
            return false;
        }
    } else {
        return false;
    }
}

export const validarExistencia = (clientes, numeroIdentificacion) => {
    let valido = true;
    clientes.forEach(cliente => {
        if ( cliente.numeroIdentificacion === numeroIdentificacion ) {
            valido = false;
        }
    });
    return valido;
}

export const validarRuc = (numeroIdentificacion) => {
    const ultimo = numeroIdentificacion?.substring(10, numeroIdentificacion.length);
    if ( ultimo !== '001' ) return false;
    return true;
}

export const validarEmail = (email) => {
    const listEmail = email?.split(',');
    let valido = true;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    listEmail?.forEach(emailItem => {
        if ( emailItem.trim().length > 0 && !re.test(String(emailItem.trim()).toLowerCase()) ) {
            valido = false;
        }
    });
    return valido;
}

export const validarNumeroDocumento = (numero) => {
    const re = /^\d{3}-\d{3}-\d{9}$/;
    let valido = true;
    if ( !re.test(numero) ) {
        valido = false;
    }
    return valido;
}