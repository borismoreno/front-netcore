import { types } from '../types/types';

const initialState = {
    tiposIdentificacion: null,
    tiposProducto: null,
    tarifasIva: null,
    empresa: null,
    formasPago: null,
    tiposDocumento: null,
    impuestosRetencion: null,
}

export const configuracionReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.configuracionTiposIdentificacion:
            return {
                ...state,
                tiposIdentificacion: action.payload,
            }
        case types.configuracionDatosEmpresa:
            return {
                ...state,
                empresa: action.payload,
            }
        case types.configuracionTiposProducto:
            return {
                ...state,
                tiposProducto: action.payload,
            }
        case types.configuracionTarifasIva:
            return {
                ...state,
                tarifasIva: action.payload,
            }
        case types.configuracionFormasPago:
            return {
                ...state,
                formasPago: action.payload
            }
        case types.configuracionTiposDocumento:
            return {
                ...state,
                tiposDocumento: action.payload
            }
        case types.configuracionImpuestosRetencion:
            return {
                ...state,
                impuestosRetencion: action.payload
            }
        default:
            return state;
    }
}