import { types } from '../types/types';

const fin = new Date();
fin.setHours(0,0,0,0);
const inicio = new Date();
inicio.setDate(1);
inicio.setHours(0,0,0,0);


const initialState = {
    comprobantesEmitidos: [],
    descargandoPdf: false,
    fechaFin: fin,
    fechaInicio: inicio,
    errorDevuelta: null,
    claveReenvio: null,
    claveReprocesar: null,
    claveAnular: null,
    detallesComprobante: [],
    autorizacionComprobante: null,
    facturasProcesadas: [],
}

export const comprobanteReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.comprobanteObtenerEmitidos:
            return {
                ...state,
                comprobantesEmitidos: action.payload
            }
        case types.comprobanteObtenerFacturasProcesadas:
            return {
                ...state,
                facturasProcesadas: action.payload
            }
        case types.comprobanteIniciarObtenerPdf:
            return {
                ...state,
                descargandoPdf: true,
            }
        case types.comprobanteTerminarObtenerPdf:
            return {
                ...state,
                descargandoPdf: false,
            }
        case types.comprobanteObtenerFechasBusqueda:
            return {
                ...state,
                fechaInicio: action.payload.fechaInicio,
                fechaFin: action.payload.fechaFin,
            }
        case types.comprobanteObtenerError:
            return {
                ...state,
                errorDevuelta: action.payload,
            }
        case types.comprobanteLimpiarError:
            return {
                ...state,
                errorDevuelta: null,
            }
        case types.comprobanteIniciarReenvioMail:
            return {
                ...state,
                claveReenvio: action.payload,
            }
        case types.comprobanteTerminarReenvioMail:
            return {
                ...state,
                claveReenvio: null,
            }
        case types.comprobantePresentarReprocesar:
            return {
                ...state,
                claveReprocesar: action.payload,
            }
        case types.comprobanteOcultarReprocesar:
            return {
                ...state,
                claveReprocesar: null,
            }
        case types.comprobantePresentarAnular:
            return {
                ...state,
                claveAnular: action.payload,
            }
        case types.comprobanteOcultarAnular:
            return {
                ...state,
                claveAnular: null,
            }
        case types.comprobanteActualizarComprobantes:
            return {
                ...state,
                comprobantesEmitidos: state.comprobantesEmitidos.map(comprobante => 
                    (comprobante.claveAcceso === action.payload.claveAcceso) ? comprobante = action.payload: 
                    comprobante)
            }
        case types.comprobanteObtenerDetalles:
            return {
                ...state,
                detallesComprobante: action.payload
            }
        case types.comprobanteObtenerAutorizacion:
            return {
                ...state,
                autorizacionComprobante: action.payload
            }
        case types.comprobanteLimpiarAutorizacion:
            return {
                ...state,
                autorizacionComprobante: null
            }
        default:
            return state;
    }
}