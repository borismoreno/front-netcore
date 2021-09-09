import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startOcultarError } from '../../actions/alerta';

export const MostrarAlerta = () => {
    const dispatch = useDispatch();
    const { mostrarError, mensajeError, tipoMensaje } = useSelector(state => state.alerta);
    const handleCerrar = () => {
        dispatch(startOcultarError());
    }
    return (
        <div>
            {
                mostrarError && (
                    <div className={`border border-t-4 ${(tipoMensaje !== 'error') ? 'bg-green-100 border-green-500 text-green-900 shadow-md': 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded-b fixed z-50 top-3 right-3 w-96`} role="alert">
                        <span className="block sm:inline">{ mensajeError }</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <i 
                                className="fas fa-window-close cursor-pointer" 
                                onClick={ handleCerrar }></i>
                        </span>
                    </div>)
            }
        </div>
    )
}
