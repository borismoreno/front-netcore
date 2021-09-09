import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { startObtenerFechas } from '../../actions/comprobante';

export const MenuFechas = () => {
    const dispatch = useDispatch();
    const fin = new Date();
    const inicio = new Date();
    const [open, setOpen] = useState(false);
    const [textoMenu, setTextoMenu] = useState('Mes actual');
    const handleMesActual = () => {
        fin.setHours(23,59,59,59);
        inicio.setDate(1);
        inicio.setHours(0,0,0,0);
        setTextoMenu('Mes actual');
        dispatch(startObtenerFechas(inicio, fin));
    }
    const handleMesAnterior = () => {
        inicio.setMonth(fin.getMonth() - 1);
        inicio.setHours(0,0,0,0);
        inicio.setDate(1);
        fin.setDate(1);
        fin.setDate(fin.getDate() - 1);
        fin.setHours(23,59,59,59);
        setTextoMenu('Mes anterior');
        dispatch(startObtenerFechas(inicio, fin));
    }
    const handleAnioActual = () => {
        inicio.setMonth(0);
        inicio.setDate(1);
        inicio.setHours(0,0,0,0);
        fin.setHours(23,59,59,59);
        setTextoMenu('Año actual');
        dispatch(startObtenerFechas(inicio, fin));
    }
    const handleAnioAnterior = () => {
        inicio.setFullYear(inicio.getFullYear() - 1);
        inicio.setMonth(0);
        inicio.setDate(1);
        inicio.setHours(0,0,0,0);
        fin.setFullYear(fin.getFullYear() - 1);
        fin.setMonth(11);
        fin.setDate(31);
        fin.setHours(23,59,59,59);
        setTextoMenu('Año anterior');
        dispatch(startObtenerFechas(inicio, fin));
    }
    const handleOnblur = () => {
        setTimeout(() => {
            setOpen(false);
        }, 200);
    }
    useEffect(() => {
        handleMesActual();
        // eslint-disable-next-line
    }, [])
    return (
        <div
            className="inline-block text-center p-2"
            onClick={() => setOpen(!open)}
            onBlur={handleOnblur}
        >
            <div>
                <button 
                    type="button" 
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" 
                    id="options-menu" 
                    aria-expanded="true" 
                    aria-haspopup="true"
                >
                {textoMenu}
                <i className="ml-2 fas fa-sort-down"></i>
                </button>
            </div>
            {open &&  
            <div 
                className="origin-top-right absolute left-4 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 py-1" 
                role="menu" 
                aria-orientation="vertical" 
                aria-labelledby="options-menu"
            >
                <div 
                    className="focus:outline-none block px-2 py-1" 
                    role="none"
                >
                    <button 
                        className="w-full px-4 py-1 bg-gray-200 text-sm rounded-md text-gray-700 hover:bg-blue-500 hover:text-gray-900 cursor-pointer disabled:opacity-20"
                        onClick={handleMesActual}
                    ><span className="">Mes actual</span></button>
                </div>
                <div 
                    className="focus:outline-none block px-2 py-1" 
                    role="none"
                >
                    <button 
                        className="w-full px-4 py-1 bg-gray-200 text-sm rounded-md text-gray-700 hover:bg-blue-500 hover:text-gray-900 cursor-pointer disabled:opacity-20"
                        onClick={handleMesAnterior}
                    ><span className="">Mes anterior</span></button>
                </div>
                <div 
                    className="focus:outline-none block px-2 py-1" 
                    role="none"
                >
                    <button 
                        className="w-full px-4 py-1 bg-gray-200 text-sm rounded-md text-gray-700 hover:bg-blue-500 hover:text-gray-900 cursor-pointer disabled:opacity-20"
                        onClick={handleAnioActual}
                    ><span className="">Año actual</span></button>
                </div>
                <div 
                    className="focus:outline-none block px-2 py-1" 
                    role="none"
                >
                    <button 
                        className="w-full px-4 py-1 bg-gray-200 text-sm rounded-md text-gray-700 hover:bg-blue-500 hover:text-gray-900 cursor-pointer disabled:opacity-20"
                        onClick={handleAnioAnterior}
                    ><span className="">Año anterior</span></button>
                </div>
            </div>}
        </div>
    )
}
