import { types } from '../types/types';

const initialState = {
    productos: [],
    productoNuevo: null
}

export const productoReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.productoObtener:
            return {
                ...state,
                productos: action.payload
            }
        case types.productoActualizar:
            return {
                ...state,
                productos: [...state.productos, action.payload],
                productoNuevo: action.payload
            }
        default:
            return state;
    }
}