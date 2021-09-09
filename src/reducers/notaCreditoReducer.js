import { types } from '../types/types';

const initialState = {
    detallesNotaCredito: [],
    notasCreditoEmitidas: [],
    claveAcceso: null,
    valoresNotaCredito: {
        subtotalDoce: 0, 
        subtotalCero: 0, 
        subtotalNoIva: 0, 
        subtotalExento: 0, 
        subtotalSinImpuestos: 0, 
        totalIva: 0, 
        valorTotal: 0
    },
}

export const notaCreditoReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.notaCreditoAgregarDetalle:
            return {
                ...state,
                detallesNotaCredito: [...state.detallesNotaCredito, action.payload],
            }
        case types.notaCreditoEliminarDetalle:
            return {
                ...state,
                detallesNotaCredito: state.detallesNotaCredito.filter(detalle => {
                    return detalle._id !== action.payload;
                })
            }
        case types.notaCreditoAgregarValores:
            return {
                ...state,
                valoresNotaCredito: action.payload
            }
        case types.notaCreditoObtenerEmitidas:
            return {
                ...state,
                notasCreditoEmitidas: action.payload
            }
        case types.notaCreditoObtenerClaveAcceso:
            return {
                ...state,
                claveAcceso: action.payload
            }
        case types.notaCreditoLimpiar:
            return initialState;
        default:
            return state;
    }
}