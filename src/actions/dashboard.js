import { fetchConToken } from '../helpers/fetch';
import { types } from '../types/types';

export const startFacturasEmitidas = (empresaId) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken(`comprobante/resumen-ventas/${empresaId}`);
        const body = await respuesta.json();
        if ( body.ok ) {
            const { facturaEmitida } = body;
            dispatch(facturasResumen(facturaEmitida));
        }
    }
}

const facturasResumen = facturaResumen => ({
    type: types.dashFacturasEmitidas,
    payload: facturaResumen,
});

export const startTotalComprobantes = (empresaId) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken(`comprobante/total-comprobantes/${empresaId}`);
        const body = await respuesta.json();
        if ( body.ok ) {
            const { facturaEmitida } = body;
            dispatch(totalComprobantes(facturaEmitida));
        }
    }
}

const totalComprobantes = comprobantes => ({
    type: types.dashTotalComprobantes,
    payload: comprobantes,
});

export const startTopClientes = empresaId => {
    return async(dispatch) => {
        const respuesta = await fetchConToken(`dashboard/top-clientes/${empresaId}`);
        const body = await respuesta.json();
        if ( body.ok ) {
            const { facturaEmitida } = body;
            dispatch(topClientes(facturaEmitida));
        }
    }
}

const topClientes = clientes => ({
    type: types.dashTopClientes,
    payload: clientes,
});