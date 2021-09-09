import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { startObtenerXml } from '../../actions/comprobante';
import { startObtenerPdfNotaCredito } from '../../actions/notaCredito';

export const MenuDescargar = ({claveAcceso, tieneXml = false}) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const handleOnblur = () => {
        setTimeout(() => {
            setOpen(false);
        }, 200);
    }
    const handleDescargarPdf = () => {
        // console.log(claveAcceso);
        if (claveAcceso) {
            dispatch(startObtenerPdfNotaCredito(claveAcceso));
        }
    }

    const handleDescargarXml = () => {
        if (claveAcceso) {
            dispatch(startObtenerXml(claveAcceso));
        }
    }
    return (
        <div 
            className="relative inline-block text-left"
            onClick={() => setOpen(!open)}
            onBlur={handleOnblur}
        >
            <div>
                <button type="button" className="flex items-center p-2 rounded-md border border-gray-400 shadow-md hover:bg-gray-100 focus:outline-none text-gray-900">
                    <i className="fas fa-file-download mr-2"></i>
                    <p className="hidden md:block">Descargar</p>
                    <i className="fas fa-chevron-down md:ml-2"></i>
                    {/* Descragar
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg> */}
                </button>
            </div>
            { open &&
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                <div className="py-1" role="none">
                    <button 
                        className="w-full px-4 py-2 text-sm font-light text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-20"
                        onClick={handleDescargarPdf}
                    ><i className="far fa-file-pdf"></i><span className="ml-4">Descargar PDF</span></button>
                    {tieneXml && <button 
                        className="w-full px-4 py-2 text-sm font-light text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-20"
                        onClick={handleDescargarXml}
                    ><i className="far fa-file-code"></i><span className="ml-4">Descargar XML</span></button>}
                </div>
                {/* <div className="py-1" role="none">
                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-2">Archive</a>
                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Move</a>
                </div>
                <div className="py-1" role="none">
                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-4">Share</a>
                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-5">Add to favorites</a>
                </div>
                <div className="py-1" role="none">
                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-6">Delete</a>
                </div> */}
            </div>}
        </div>
    )
}
