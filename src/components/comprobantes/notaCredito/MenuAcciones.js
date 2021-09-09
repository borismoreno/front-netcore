import React from 'react';
import { useDispatch } from 'react-redux';
import { startObtenerPdfNotaCredito } from '../../../actions/notaCredito';

const MenuAcciones = ({claveAcceso}) => {
    const dispatch = useDispatch();
    const handleDescargarPdf = () => {
        if (claveAcceso) {
            dispatch(startObtenerPdfNotaCredito(claveAcceso));
        }
    }
    return ( 
        <div className='flex flex-col md:flex-row justify-evenly text-center p-4 pr-6'>
            <button className='has-tooltip focus:outline-none md:mr-4'>
                <span className='tooltip text-xs rounded shadow-lg px-5 py-2 bg-gray-200 text-gray-600 -mt-8 -ml-8'>Anular</span>
                <i className="fas fa-times-circle text-red-400"></i>
            </button>
            <button className='has-tooltip focus:outline-none md:mr-4'>
                <span className='tooltip text-xs rounded shadow-lg px-5 py-2 bg-gray-200 text-gray-600 -mt-8 -ml-8'>Mail</span>
                <i className="fas fa-envelope text-blue-400"></i>
            </button>
            <button className='has-tooltip focus:outline-none'
                onClick={handleDescargarPdf}
            >
            <span className='tooltip text-xs rounded shadow-lg px-5 py-2 bg-gray-200 text-gray-600 -mt-8 -ml-8'>Descargar</span>
                <i className="fas fa-file-download text-green-500"></i>
            </button>
            {/* <button>3</button> */}
        </div>
     );
}
 
export default MenuAcciones;