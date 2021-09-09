import { fetchConToken } from '../helpers/fetch';
import { types } from '../types/types';

export const startObtenerClientes = () => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('clientes/V2');
        const body = await respuesta.json();
        if (body.ok) {
            dispatch(obtenerClientes(body.clientes));
        }
    }
}

const obtenerClientes = (clientes) => ({ 
    type: types.clientesObtener,
    payload: clientes
});

export const startBuscarCliente = (numeroIdentificacion) => {
    return async(dispatch) => {
        dispatch(buscarCliente(numeroIdentificacion));
    }
}

const buscarCliente = (numeroIdentificacion) => ({
    type: types.clientesBuscar,
    payload: numeroIdentificacion
})

export const startSeleccionarCliente = (clienteSeleccionado) => {
    return async(dispatch) => {
        dispatch(seleccionarCliente(clienteSeleccionado));
    }
}

const seleccionarCliente = (clienteSeleccionado) => ({
    type: types.clientesSeleccionar,
    payload: clienteSeleccionado
})

export const startLimpiarSeleccion = () => {
    return async(dispatch) => {
        dispatch(limpiarSeleccion());
    }
}

const limpiarSeleccion = () => ({ type: types.clientesLimpiarSeleccion })

export const startGuardarCliente = (cliente) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('clientes/guardar-cliente', cliente, 'POST');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(guardarCliente(body.cliente));
        }
    }
}

const guardarCliente = (cliente) => ({
    type: types.clientesGuardarCliente,
    payload: cliente
})