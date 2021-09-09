import { types } from '../types/types';

const initialState = {
    mostrarError: false,
    mensajeError: '',
    mostrarCargando: false,
    tipoMensaje: 'error',
}

export const alertaReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.alertaMostrar:
            return {
                ...state,
                mostrarError: true,
                mensajeError: action.payload.mensaje,
                tipoMensaje: action.payload.tipoMensaje
            };
        case types.alertaOcultar:
            return {
                ...state,
                mostrarError: false,
                mensajeError: ''
            }
        case types.cargandoMostrar:
            return {
                ...state,
                mostrarCargando: true,
            }
        case types.cargandoOcultar:
            return {
                ...state,
                mostrarCargando: false
            }
        default:
            return state;
    }
}