import { types } from '../types/types';
const initialState = {
    cargando: false,
}

export const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.uiMostrarCargando:
            return {
                ...state,
                cargando: true,
            }
        case types.uiOcultarCargando:
            return {
                ...state,
                cargando: false,
            }
        default:
            return state;
    }
}