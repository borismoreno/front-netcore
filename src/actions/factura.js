import { fetchConToken } from '../helpers/fetch';
import { types } from '../types/types';
import { startMostrarCargandoAlerta, startMostrarError, startOcultarCargandoAlerta } from './alerta';
import { startObtenerDatosEmpresa } from './configuracion';

export const startAgregarDetalle = (detalle) => {
    return (dispatch) => {
        dispatch(agregarDetalle(detalle));
    }
}

const agregarDetalle = (detalle) => ({
    type: types.facturaAgregarDetalle,
    payload: detalle
})

export const startLimpiarDatosFactura = () => {
    return (dispatch) => {
        dispatch(limpiarDatosFactura());
    }
}

const limpiarDatosFactura = () => ({ type: types.facturaLimpiarFactura })

export const startAgregarAdicional = (adicional) => {
    return (dispatch) => {
        dispatch(agregarAdicional(adicional));
    }
}

const agregarAdicional = (adicional) => ({
    type: types.facturaAgregarAdicional,
    payload: adicional
})

export const startAgregarFormaPago = (formaPago) => {
    return (dispatch) => {
        dispatch(agregarFormaPago(formaPago));
    }
}

const agregarFormaPago = (formaPago) => ({
    type: types.facturaAgregarFormaPago,
    payload: formaPago
})

export const startAgregarValoresFactura = (valoresFactura) => {
    return (dispatch) => {
        dispatch(agregarValoresFactura(valoresFactura));
    }
}

const agregarValoresFactura = (valoresFactura) => ({
    type: types.facturaValoresFactura,
    payload: valoresFactura
})

export const startActualizarDetallesFactura = (detallesFactura) => {
    return (dispatch) => {
        dispatch(actualizarDetallesFactura(detallesFactura));
    }
}

const actualizarDetallesFactura = (detallesFactura) => ({
    type: types.facturaActualizarDetalles,
    payload: detallesFactura
})

export const startActualizarDetalleFactura = (detalleFactura) => {
    return (dispatch) => {
        dispatch(actualizarDetalle(detalleFactura));
    }
}

const actualizarDetalle = (detalleFactura) => ({
    type: types.facturaActualizarDetalle,
    payload: detalleFactura
})

export const startActualizarAdicionales = (datosAdicionales) => {
    return (dispatch) => {
        dispatch(actualizarAdicionales(datosAdicionales));
    }
}

const actualizarAdicionales = (datosAdicionales) => ({
    type: types.facturaActualizarAdicionales,
    payload: datosAdicionales
})

export const startActualizarFormasPago = (formasPago) => {
    return (dispatch) => {
        dispatch(actualizarFormasPago(formasPago));
    }
}

const actualizarFormasPago = (formasPago) => ({
    type: types.facturaActualizarFormasPago,
    payload: formasPago
})

export const startObtenerClaveAcceso = (claveAcceso) => {
    return (dispatch) => {
        dispatch(obtenerClaveAcceso(claveAcceso));
    }
}

const obtenerClaveAcceso = (claveAcceso) => ({
    type: types.facturaObtenerClaveAcceso,
    payload: claveAcceso
})

export const startEmitirFactura = (envioFactura) => {
    return async (dispatch) => {
        try {
            const { empresa } = envioFactura;
            const respuesta = await fetchConToken('factura', envioFactura, 'POST');
            const body = await respuesta.json();
            if (body.ok) {
                console.log(body);
                dispatch(startOcultarCargandoAlerta());
                // dispatch(startObtenerClaveAcceso(body.claveAcceso));
                // dispatch(startObtenerDatosEmpresa(empresa._id));
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const startRegistrarPago = (pagoFactura) => {
    return async(dispatch) => {
        try {
            dispatch(startMostrarCargandoAlerta());
            const respuesta = await fetchConToken('comprobante/registrar-pago', pagoFactura, 'POST');
            const body = await respuesta.json();
            if (body.ok) {
                dispatch(startMostrarError('Pago registrado correctamente.', 'correcto'));
                dispatch(startOcultarCargandoAlerta());
                dispatch(actualizarComprobantes(body.comprobante));
            }
        } catch (error) {
            console.log(error);
            dispatch(startOcultarCargandoAlerta());
        }
    }
}

export const startEliminarPago = (datos) => {
    return async(dispatch) => {
        try {
            dispatch(startMostrarCargandoAlerta());
            const respuesta = await fetchConToken('comprobante/eliminar-pago', datos, 'POST');
            const body = await respuesta.json();
            if (body.ok) {
                dispatch(startMostrarError('Pago eliminado correctamente.', 'correcto'));
                dispatch(actualizarComprobantes(body.comprobante));
                dispatch(startOcultarCargandoAlerta());
            }
        } catch (error) {
            console.log(error);
            dispatch(startOcultarCargandoAlerta());
        }
    }
}

const actualizarComprobantes = (comprobante) => ({
    type: types.comprobanteActualizarComprobantes,
    payload: comprobante
})