import React, { useState } from 'react';

export const MenuAccionesFactura = () => {
    const [open, setOpen] = useState(false);
    // const dispatch = useDispatch();
    const handleOnblur = () => {
        setTimeout(() => {
            setOpen(false);
        }, 200);
    }
    return (
        <div 
            className="relative inline-block text-left ml-2"
            onClick={() => setOpen(!open)}
            onBlur={handleOnblur}
        >
            <div>
                <button type="button" className="flex items-center p-2 rounded-md border border-gray-400 shadow-md hover:bg-gray-100 focus:outline-none text-gray-900">
                    <i className="fas fa-ellipsis-h p-1"></i>
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
                        // onClick={handleDescargarPdf}
                    ><i className="fas fa-exclamation-circle"></i><span className="ml-4">Anular Comprobante</span></button>
                    
                </div>
            </div>}
        </div>
    )
}
