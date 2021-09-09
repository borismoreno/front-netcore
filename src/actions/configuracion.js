import { fetchConToken } from '../helpers/fetch';
import { types } from '../types/types';

export const startBuscarTipoIdentificacion = () => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('configuracion/tiposIdentificacion');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(buscarTipoIdentificacion(body.tiposIdentificacion));
        }
    }
}

const buscarTipoIdentificacion = (tiposIdentificacion) => ({
    type: types.configuracionTiposIdentificacion,
    payload: tiposIdentificacion
});

export const startObtenerDatosEmpresa = (empresaId) => {
    return async(dispatch) => {
        const respuesta = await fetchConToken(`empresas/configuracion/${empresaId}`);
        const body = await respuesta.json();
        const { ok, secuencialFactura, secuencialNotaCredito, secuencialRetencion, puntoEmision, establecimiento, razonSocial } = body;
        if ( ok ) {
            dispatch(obtenerDatosEmpresa({
                secuencialFactura,
                secuencialNotaCredito,
                secuencialRetencion,
                puntoEmision,
                establecimiento,
                razonSocial
            }));
        }
    }
}

const obtenerDatosEmpresa = (empresa) => ({
    type: types.configuracionDatosEmpresa,
    payload: empresa
})

export const startObtenerTiposProducto = () => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('configuracion/tiposProducto');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerTiposProducto(body.tiposProducto));
        }
    }
}

const obtenerTiposProducto = (tiposProducto) => ({
    type: types.configuracionTiposProducto,
    payload: tiposProducto
})

export const startObtenerTarifasIva = () => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('configuracion/tarifasIva');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerTarifasIva(body.tarifasIva));
        }
    }
}

const obtenerTarifasIva = (tarifasIva) => ({
    type: types.configuracionTarifasIva,
    payload: tarifasIva
})

export const startObtenerFormasPago = () => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('configuracion/tiposFormaPago');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerFormasPago(body.tiposFormaPago));
        }
    }
}

const obtenerFormasPago = (tiposFormaPago) => ({
    type: types.configuracionFormasPago,
    payload: tiposFormaPago
});

export const startObtenerTiposDocumento = () => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('configuracion/tiposDocumento');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerTiposDocumento(body.tiposDocumento));
        }
    }
}

const obtenerTiposDocumento = (tiposDocumento) => ({
    type: types.configuracionTiposDocumento,
    payload: tiposDocumento
});

export const startObtenerImpuestosRetencion = () => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('configuracion/impuestosRetencion');
        const body = await respuesta.json();
        if ( body.ok ) {
            dispatch(obtenerImpuestosRetencion(body.impuestosRetencion));
        }
    }
}

const obtenerImpuestosRetencion = (impuestosRetencion) => ({
    type: types.configuracionImpuestosRetencion,
    payload: impuestosRetencion
});