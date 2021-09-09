import { types } from '../types/types';

const initialState = {
    detallesRetencion: [],
    retencionesEmitidas: [],
    claveAcceso: null,
    detallesEmitida: [],
}

export const retencionReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.retencionAgregarDetalle:
            return {
                ...state,
                detallesRetencion: [...state.detallesRetencion, action.payload],
            }
        case types.retencionEliminarDetalle:
            return {
                ...state,
                detallesRetencion: state.detallesRetencion.filter(detalle => {
                    return detalle._id !== action.payload;
                })
            }
        case types.retencionObtenerEmitidas:
            return {
                ...state,
                retencionesEmitidas: action.payload
            }
        case types.retencionObtenerClaveAcceso:
            return {
                ...state,
                claveAcceso: action.payload
            }
        case types.retencionObtenerDetalles:
            return {
                ...state,
                detallesEmitida: action.payload
            }
        case types.retencionLimpiar:
            return initialState;
        default:
            return state;
    }
}