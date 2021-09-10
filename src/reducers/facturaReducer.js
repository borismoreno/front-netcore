import { types } from '../types/types';

const initialState = {
    detallesFactura: [],
    adicionalesFactura: [],
    formasPagoFactura: [],
    claveAcceso: null,
    cerrarModal: false,
    valoresFactura: {
        subtotalDoce: 0, 
        subtotalCero: 0, 
        subtotalNoIva: 0, 
        subtotalExento: 0, 
        subtotalSinImpuestos: 0, 
        totalIva: 0, 
        valorTotal: 0
    }
}

export const facturaReducer = (state = initialState, action) =>{
    switch (action.type) {
        case types.facturaAgregarDetalle:
            return {
                ...state,
                detallesFactura: [...state.detallesFactura, action.payload],
            }
        case types.facturaAgregarAdicional:
            return {
                ...state,
                adicionalesFactura: [...state.adicionalesFactura, action.payload],
            }
        case types.facturaActualizarDetalle:
            return {
                ...state,
                detallesFactura: state.detallesFactura.map(detalle => (detalle.id!==action.payload.id ? detalle : action.payload))
            }
        case types.facturaAgregarFormaPago:
            return {
                ...state,
                formasPagoFactura: [...state.formasPagoFactura, action.payload],
            }
        case types.facturaLimpiarFactura:
            return {
                ...state,
                detallesFactura: [],
                adicionalesFactura: [],
                formasPagoFactura: [],
                valoresFactura: initialState.valoresFactura,
                claveAcceso: null,
            }
        case types.facturaValoresFactura:
            return {
                ...state,
                valoresFactura: action.payload,
            }
        case types.facturaActualizarDetalles:
            return {
                ...state,
                detallesFactura: action.payload
            }
        case types.facturaActualizarAdicionales:
            return {
                ...state,
                adicionalesFactura: action.payload
            }
        case types.facturaActualizarFormasPago:
            return {
                ...state,
                formasPagoFactura: action.payload
            }
        case types.facturaObtenerClaveAcceso:
            return {
                ...state,
                claveAcceso: action.payload
            }
        case types.facturaCerrarModal:
            return {
                ...state,
                cerrarModal: action.payload
            }
        default:
            return state;
    }
}