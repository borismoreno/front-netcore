import { fetchConToken } from '../helpers/fetch';
import { saveAs } from 'file-saver';
import { types } from '../types/types';
import { startObtenerClaveAcceso } from './factura';
import { startOcultarCargando } from './ui';
import { startMostrarCargandoAlerta, startMostrarError, startOcultarCargandoAlerta } from './alerta';

export const startObtenerComprobantesEmitidos = (fechaInicio, fechaFin) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('comprobante/comprobantes-emitidos',{fechaInicio,fechaFin}, 'POST');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerComprobantesEmitidos(body.comprobantes));
        }
    }
}

export const startObtenerFacturasProcesadas = () => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('comprobante/facturas-emitidas');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerFacturasProcesadas(body.facturas));
        }
    }
}

export const startObtenerDetallesFactura = (facturaId) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken(`comprobante/obtener-detalles/${facturaId}`);
        const body = await respuesta.json();
        const { ok, detalles } = body;
        if (ok) {
            dispatch(obtenerDetallesComprobante(detalles));
        }
    }
}

export const startObtenerPdf = (claveAcceso) => {
    return async(dispatch) => {
        try {
            dispatch(iniciarObtenerPdf());
            const respuesta = await fetchConToken(`comprobante/obtener-pdf/${claveAcceso}`);
            const body = await respuesta.blob();
            saveAs(body, claveAcceso);
            dispatch(terminarObtenerPdf());
        } catch (error) {
            console.log(error);        
            dispatch(terminarObtenerPdf());
        }
    }
}

export const startObtenerXml = (claveAcceso) => {
    return async(dispatch) => {
        try {
            dispatch(iniciarObtenerPdf());
            const respuesta = await fetchConToken(`comprobante/obtener-xml/${claveAcceso}`);
            const body = await respuesta.blob();
            saveAs(body, claveAcceso);
            dispatch(terminarObtenerPdf());
        } catch (error) {
            console.log(error);        
            dispatch(terminarObtenerPdf());
        }
    }
}

export const startObtenerFechas = (fechaInicio, fechaFin) => {
    return async(dispatch) => {
        dispatch(obtenerFechas({fechaInicio, fechaFin}));
    }
}

export const startObtenerError = (facturaId) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken(`errores/error-devuelta/${facturaId}`);
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerError(body.errorDevuelta));
        }
    }
}

export const startObtenerAutorizacionComprobante = (facturaId) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken(`comprobante/obtener-autorizacion/${facturaId}`);
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerAutorizacion(body.autorizacionComprobante));
        }
    }
}

export const startLimpiarError = () => {
    return async(dispatch) => {
        dispatch(limpiarError());
    }
}

export const startLimpiarAutorizacion = () => {
    return async(dispatch) => {
        dispatch(limpiarAutorizacion());
    }
}

export const startReenviarMail = (claveAcceso) => {
    return async(dispatch) => {
        dispatch(reenviarMail(claveAcceso));
    }
}

export const terminarReenviarMail = () => {
    return async(dispatch) => {
        dispatch(limpiarReenvioMail());
    }
}

export const startReenvio = (datos, tipoComprobante) => {
    return async(dispatch) => {
        try {
            dispatch(startMostrarCargandoAlerta());
            const respuesta = await fetchConToken(`${tipoComprobante}/reenvio-mail`, datos, 'POST');
            const body = await respuesta.json();
            if (body.ok) {
                dispatch(startMostrarError('Mail enviado correctamente.', 'correcto'));
            } else {
                dispatch(startMostrarError('Hubo un error al enviar el mail.'));
            }
            dispatch(limpiarReenvioMail());
            dispatch(startOcultarCargandoAlerta());
        } catch (error) {
            dispatch(startMostrarError('Hubo un error al enviar el mail.'));
            dispatch(startOcultarCargandoAlerta());
            console.log(error);
        }
    }
}

export const startPresentarReprocesar = (claveAcceso) => {
    return (dispatch) => {
        dispatch(presentarReprocesar(claveAcceso));
    }
}

export const startOcultarReprocesar = () => {
    return (dispatch) => {
        dispatch(ocultarReprocesar());
    }
}

export const startPresentarAnular = (claveAcceso) => {
    return (dispatch) => {
        dispatch(presentarAnular(claveAcceso));
    }
}

export const startOcultarAnular = () => {
    return (dispatch) => {
        dispatch(ocultarAnular());
    }
}

export const startReprocesarComprobante = (claveAcceso) => {
    return async(dispatch) => {
        try {
            const respuesta = await fetchConToken('comprobante/reenvio', {claveAcceso}, 'POST');
            const body = await respuesta.json();
            if (body.ok) {
                dispatch(startObtenerClaveAcceso(body.claveAcceso));
                dispatch(ocultarReprocesar());
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const startObtenerAutorizacion = (claveAcceso) => {
    return async(dispatch) => {
        try {
            await fetchConToken('comprobante/obtener-autorizacion', {claveAcceso}, 'POST');
            dispatch(startOcultarCargando());
        } catch (error) {
            console.log(error);
        }
    }
}

export const startEnviarMail = (claveAcceso) => {
    return async(dispatch) => {
        try {
            const respuesta = await fetchConToken('comprobante/enviar-mail', {claveAcceso}, 'POST');
            const body = await respuesta.json();
            if ( body.ok ) {
                const { comprobante } = body;
                comprobante.estadoComprobante = 'EMA';
                dispatch(startMostrarError('Mail enviado correctamente.', 'correcto'));
                dispatch(actualizarComprobantes(comprobante));
            } else {
                if ( body.msg ) {
                    dispatch(startMostrarError(body.msg));
                }
            }
        } catch (error) {
            console.log(error);
        }
        dispatch(startOcultarCargando());
    }
}

export const startAnularComprobante = (claveAcceso) => {
    return async(dispatch) => {
        try {
                dispatch(startMostrarError('Comprobante anulado correctamente.', 'correcto'));
                dispatch(ocultarAnular());
                // dispatch(actualizarComprobantes(comprobante));
            //     const respuesta = await fetchConToken('comprobante/anular-comprobante', {claveAcceso}, 'POST');
            // const body = await respuesta.json();
            // if ( body.ok ) {
            //     const { comprobante } = body;
            //     comprobante.estadoComprobante = 'ANU';
            //     dispatch(startMostrarError('Comprobante anulado correctamente.', 'correcto'));
            //     dispatch(ocultarAnular());
            //     dispatch(actualizarComprobantes(comprobante));
            // } else {
            //     if ( body.msg ) {
            //         dispatch(startMostrarError(body.msg));
            //     }
            // }
        } catch (error) {
            console.log(error);
        }
        dispatch(startOcultarCargando());
    }
}

const obtenerComprobantesEmitidos = (comprobantes) => ({
    type: types.comprobanteObtenerEmitidos,
    payload: comprobantes
});

const obtenerFacturasProcesadas = (facturas) => ({
    type: types.comprobanteObtenerFacturasProcesadas,
    payload: facturas
})

const obtenerDetallesComprobante = (detalles) => ({
    type: types.comprobanteObtenerDetalles,
    payload: detalles
});

const iniciarObtenerPdf = () => ({type: types.comprobanteIniciarObtenerPdf});

const terminarObtenerPdf = () => ({type: types.comprobanteTerminarObtenerPdf});

const limpiarError = () => ({type: types.comprobanteLimpiarError});

const limpiarAutorizacion = () => ({type: types.comprobanteLimpiarAutorizacion});

const obtenerFechas = (fechas) => ({
    type: types.comprobanteObtenerFechasBusqueda,
    payload: fechas
});

const obtenerError = (error) => ({
    type: types.comprobanteObtenerError,
    payload: error
});

const obtenerAutorizacion = (autorizacion) => ({
    type: types.comprobanteObtenerAutorizacion,
    payload: autorizacion
});

const reenviarMail = (claveAcceso) => ({
    type: types.comprobanteIniciarReenvioMail,
    payload: claveAcceso
});

const actualizarComprobantes = (comprobante) => ({
    type: types.comprobanteActualizarComprobantes,
    payload: comprobante
})

const limpiarReenvioMail = () => ({type: types.comprobanteTerminarReenvioMail});

const presentarReprocesar = (claveAcceso) => ({
    type: types.comprobantePresentarReprocesar,
    payload: claveAcceso
});

const ocultarReprocesar = () => ({type: types.comprobanteOcultarReprocesar});

const presentarAnular = (claveAcceso) => ({
    type: types.comprobantePresentarAnular,
    payload: claveAcceso
});

const ocultarAnular = () => ({type: types.comprobanteOcultarAnular});