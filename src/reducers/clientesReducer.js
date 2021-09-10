import { types } from '../types/types';

const initialState = {
    clientes: [],
    identificacionBuscar: '',
    clienteSeleccionado: null,
    cerrarModalCliente: false
}

export const clientesReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.clientesObtener:
            return {
                ...state,
                clientes: action.payload
            };
        case types.clientesBuscar:
            return {
                ...state,
                identificacionBuscar: action.payload,
            }
        case types.clientesSeleccionar: 
            return {
                ...state,
                clienteSeleccionado: action.payload
            }
        case types.clientesLimpiarSeleccion:
            return {
                ...state,
                clienteSeleccionado: null
            }
        case types.clientesLimpiarCerrarModal:
            return {
                ...state,
                cerrarModalCliente: false
            }
        case types.clientesGuardarCliente:
            return {
                ...state,
                clientes: [...state.clientes, action.payload],
                clienteSeleccionado: action.payload,
                cerrarModalCliente: true
            }
        default:
            return state;
    }
}