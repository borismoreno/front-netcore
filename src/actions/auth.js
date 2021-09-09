import { fetchConToken, fetchSinToken } from '../helpers/fetch';
import { startMostrarError } from '../actions/alerta';
import { types } from '../types/types';

export const startLogin = (email, password) => {
    return async(dispatch) => {
        const respuesta = await fetchSinToken('usuarios/login', { email, password }, 'POST');
        const body = await respuesta.json();
        if ( body.ok ) {
            localStorage.setItem('token', body.token);
            const { nombre, uid, nombreComercial, empresaId } = body;
            dispatch(login({
                nombre,
                uid,
                nombreComercial,
                empresaId
            }));
        } else {
            if ( body.msg ) {
                dispatch(startMostrarError(body.msg));
            } else {
                console.log(body)
                dispatch(startMostrarError(body.errores[0].msg));
            }
            return;
        }
    }
}

export const startChecking = () => {
    return async(dispatch) => {
        const respuesta = await fetchConToken('usuarios/renew');
        console.log("renew");
        const body = await respuesta.json();
        if ( body.ok ) {
            localStorage.setItem('token', body.token);
            const { nombre, uid, nombreComercial, empresaId } = body;
            dispatch(login({
                nombre,
                uid,
                nombreComercial,
                empresaId
            }));
        } else {
            dispatch(checkingFinish());
        }
    }
}

const login = user => ({
    type: types.authLogin,
    payload: user,
});

const checkingFinish = () => ({ type: types.authCheckingFinish })

export const startLogout = () => {
    return (dispatch) => {
        localStorage.clear();
        dispatch(logout());
        dispatch(limpiar());
    }
}

const logout =() => ({ type: types.authLogout })

const limpiar =() => ({ type: types.dashLimpiar })
