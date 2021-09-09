import { types } from '../types/types';

export const startMostrarCargando = () => {
    return (dispatch) => {
        dispatch((mostrarCargando()));
    }
}

export const startOcultarCargando = () => {
    return (dispatch) => {
        dispatch(ocultarCargando());
    }
}

const mostrarCargando = () => ({type: types.uiMostrarCargando});

const ocultarCargando = () => ({type: types.uiOcultarCargando});