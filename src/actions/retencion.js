import { fetchConToken } from '../helpers/fetch';
import { types } from '../types/types';
import { saveAs } from 'file-saver';
import { startOcultarCargandoAlerta } from './alerta';
import { startObtenerDatosEmpresa } from './configuracion';

export const startAgregarDetalleRetencion = (detalle) => {
    return (dispatch) => {
        dispatch(agregarDetalleRetencion(detalle));
    }
}

const agregarDetalleRetencion = (detalle) => ({
    type: types.retencionAgregarDetalle,
    payload: detalle
});

export const startEliminarDetalleRetencion = (detalleId) => {
    return (dispatch) => {
        dispatch(eliminarDetalle(detalleId));
    }
}

const eliminarDetalle = (detalleId) => ({
    type: types.retencionEliminarDetalle,
    payload: detalleId
});

export const startEmitirRetencion = (datosRetencion) => {
    return async(dispatch) => {
        try {
            const { empresa } = datosRetencion;
            const respuesta = await fetchConToken('retencion/', datosRetencion, 'POST');
            const body = await respuesta.json();
            if (body.ok) {
                dispatch(startOcultarCargandoAlerta());
                dispatch(obtenerClaveAcceso(body.claveAcceso));
                dispatch(startObtenerDatosEmpresa(empresa._id));
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const startObtenerRetencionesEmitidas = (fechaInicio, fechaFin) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('retencion/emitidas',{fechaInicio,fechaFin}, 'POST');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerRetencionesEmitidas(body.retenciones));
        }
    }
}

export const startLimpiarDatosRetencion = () => {
    return (dispatch) => {
        dispatch(limpiarDatosRetencion());
    }
}

export const startObtenerPdfRetencion = (claveAcceso) => {
    return async(dispatch) => {
        try {
            dispatch(iniciarObtenerPdf());
            const respuesta = await fetchConToken(`retencion/obtener-pdf/${claveAcceso}`);
            const body = await respuesta.blob();
            saveAs(body, claveAcceso);
            dispatch(terminarObtenerPdf());
        } catch (error) {
            console.log(error);        
            dispatch(terminarObtenerPdf());
        }
    }
}

export const startObtenerDetallesRetencion = (retencionId) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken(`retencion/obtener-detalles/${retencionId}`);
        const body = await respuesta.json();
        const { ok, detalles } = body;
        if (ok) {
            dispatch(obtenerDetallesRetencion(detalles));
        }
    }
}

const obtenerRetencionesEmitidas = (retenciones) => ({
    type: types.retencionObtenerEmitidas,
    payload: retenciones
});

const obtenerClaveAcceso = (claveAcceso) => ({
    type: types.retencionObtenerClaveAcceso,
    payload: claveAcceso
});

const obtenerDetallesRetencion = (detalles) => ({
    type: types.retencionObtenerDetalles,
    payload: detalles
});

const limpiarDatosRetencion = () => ({ type: types.retencionLimpiar });

const iniciarObtenerPdf = () => ({type: types.comprobanteIniciarObtenerPdf});

const terminarObtenerPdf = () => ({type: types.comprobanteTerminarObtenerPdf});