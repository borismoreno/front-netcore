import { fetchConToken } from "../helpers/fetch";
import { types } from "../types/types";
import { startMostrarError, startOcultarCargandoAlerta } from "./alerta";

export const startAgregarProducto = (producto) => {
    return async (dispatch) => {
        try {
            const respuesta = await fetchConToken('productos',producto,'POST');
            const body = await respuesta.json();
            dispatch(startOcultarCargandoAlerta());
            const { ok, msg, producto:prod } = body;
            if (ok) {
                dispatch(cerrarModalProducto(true));
                dispatch(agregarProducto(prod));
            } else {
                dispatch(startMostrarError(msg,'error'));
            }
        } catch (error) {
            console.log(error);
            dispatch(startOcultarCargandoAlerta());
        }
    }
}

export const startObtenerProductos = () => {
    return async (dispatch) => {
        try {
            const respuesta = await fetchConToken('productos');
            const body = await respuesta.json();
            const { ok, productos } = body;
            if (ok) {
                dispatch(obtenerProductos(productos));
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const startLimpiarProductoSeleccionado = () => {
    return async (dispatch) => {
        dispatch(limpiarProductoSeleccionado());
    }
}

export const startCerrarModalProducto = (cerrar = true) => {
    return async (dispatch) => {
        dispatch(cerrarModalProducto(cerrar));
    }
}

const cerrarModalProducto = (cerrar = true) => ({
    type: types.facturaCerrarModal,
    payload: cerrar
})

const obtenerProductos = (productos) => ({
    type: types.productoObtener,
    payload: productos
})

const agregarProducto = (producto) => ({
    type: types.productoActualizar,
    payload: producto
})

const limpiarProductoSeleccionado = () => ({ type: types.productoEliminarSeleccionado })
