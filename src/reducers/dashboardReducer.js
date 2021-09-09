import { types } from '../types/types';

const initialState = {
    facturasResumen: [],
    totalComprobantes: [],
    topClientes: [],
}

export const dashboardReducer = ( state = initialState, action ) => {
    switch (action.type) {
        case types.dashFacturasEmitidas:
            return {
                ...state,
                facturasResumen: action.payload,
            }
        case types.dashTotalComprobantes:
            return {
                ...state,
                totalComprobantes: action.payload,
            }
        case types.dashLimpiar:
            return {
                ...state,
                facturasResumen: [],
                totalComprobantes: [],
                topClientes: [],
            }
        case types.dashTopClientes:
            return {
                ...state,
                topClientes: action.payload,
            }
        default:
            return state;
    }
}