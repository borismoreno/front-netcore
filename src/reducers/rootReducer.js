import { combineReducers } from 'redux';
import { alertaReducer } from './alertaReducer';
import { authReducer } from './authReducer';
import { clientesReducer } from './clientesReducer';
import { comprobanteReducer } from './comprobanteReducer';
import { configuracionReducer } from './configuracionReducer';
import { dashboardReducer } from './dashboardReducer';
import { facturaReducer } from './facturaReducer';
import { notaCreditoReducer } from './notaCreditoReducer';
import { retencionReducer } from './retencionReducer';
import { productoReducer } from './productoReducer';
import { uiReducer } from './uiReducer';

export const rootReducer = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    alerta: alertaReducer,
    clientes: clientesReducer,
    configuracion: configuracionReducer,
    factura: facturaReducer,
    notaCredito: notaCreditoReducer,
    retencion: retencionReducer,
    comprobante: comprobanteReducer,
    producto: productoReducer,
    ui: uiReducer,
})