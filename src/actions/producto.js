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
                dispatch(cerrarModalProducto());
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

const cerrarModalProducto = () => ({
    type: types.facturaCerrarModal
})

const obtenerProductos = (productos) => ({
    type: types.productoObtener,
    payload: productos
})

const agregarProducto = (producto) => ({
    type: types.productoActualizar,
    payload: producto
})