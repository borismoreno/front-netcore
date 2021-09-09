import { fetchConToken } from '../helpers/fetch';
import { types } from '../types/types';
import { saveAs } from 'file-saver';
import { startOcultarCargandoAlerta } from './alerta';
import { startObtenerDatosEmpresa } from './configuracion';

export const startAgregarDetalle = (detalle) => {
    return (dispatch) => {
        dispatch(agregarDetalle(detalle));
    }
}

const agregarDetalle = (detalle) => ({
    type: types.notaCreditoAgregarDetalle,
    payload: detalle
});

export const startLimpiarDatosNotaCredito = () => {
    return (dispatch) => {
        dispatch(limpiarDatosNotaCredito());
    }
}

const limpiarDatosNotaCredito = () => ({ type: types.notaCreditoLimpiar });

export const startEliminarDetalle = (detalleId) => {
    return (dispatch) => {
        dispatch(eliminarDetalle(detalleId));
    }
}

const eliminarDetalle = (detalleId) => ({
    type: types.notaCreditoEliminarDetalle,
    payload: detalleId
});

export const startAgregarValoresNotaCredito = (valoresNotaCredito) => {
    return (dispatch) => {
        dispatch(agregarValoresNotaCredito(valoresNotaCredito));
    }
}

const agregarValoresNotaCredito = (valoresNotaCredito) => ({
    type: types.notaCreditoAgregarValores,
    payload: valoresNotaCredito
});

export const startEmitirNotaCredito = (datosNotaCredito) => {
    return async(dispatch) => {
        try {
            const { empresa } = datosNotaCredito;
            const respuesta = await fetchConToken('notaCredito/', datosNotaCredito, 'POST');
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

export const startObtenerNotasCreditoEmitidas = (fechaInicio, fechaFin) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('notaCredito/emitidas',{fechaInicio,fechaFin}, 'POST');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerNotasCreditoEmitidas(body.notasCredito));
        }
    }
}

export const startObtenerPdfNotaCredito = (claveAcceso) => {
    return async(dispatch) => {
        try {
            dispatch(iniciarObtenerPdf());
            const respuesta = await fetchConToken(`notaCredito/obtener-pdf/${claveAcceso}`);
            const body = await respuesta.blob();
            saveAs(body, claveAcceso);
            dispatch(terminarObtenerPdf());
        } catch (error) {
            console.log(error);        
            dispatch(terminarObtenerPdf());
        }
    }
}

const obtenerNotasCreditoEmitidas = (notasCredito) => ({
    type: types.notaCreditoObtenerEmitidas,
    payload: notasCredito
});

const obtenerClaveAcceso = (claveAcceso) => ({
    type: types.notaCreditoObtenerClaveAcceso,
    payload: claveAcceso
});

const iniciarObtenerPdf = () => ({type: types.comprobanteIniciarObtenerPdf});

const terminarObtenerPdf = () => ({type: types.comprobanteTerminarObtenerPdf});