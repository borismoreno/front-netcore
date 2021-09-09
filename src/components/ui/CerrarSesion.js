import React from 'react';
import { useDispatch } from 'react-redux';
import { startLogout } from '../../actions/auth';

export const CerrarSesion = () => {
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(startLogout());
    }
    return (
        <button
            onClick={handleLogout}
            className="text-black md:text-white flex items-center"
        >
            <i className="fas fa-sign-out-alt mr-2"></i>
            <p className="uppercase">Salir</p>
        </button>
    )
}
