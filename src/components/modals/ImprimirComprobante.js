import React from 'react'
import { useDispatch } from 'react-redux'
import { startLimpiarSeleccion } from '../../actions/clientes';
import { startObtenerPdf } from '../../actions/comprobante';
import { startLimpiarDatosFactura } from '../../actions/factura';
import { startLimpiarDatosNotaCredito, startObtenerPdfNotaCredito } from '../../actions/notaCredito';
import { startLimpiarDatosRetencion, startObtenerPdfRetencion } from '../../actions/retencion';

export const ImprimirComprobante = ({claveAcceso, history, tipoComprobante}) => {
    const dispatch = useDispatch();
    const handleCerrar = () => {
        switch (tipoComprobante) {
            case 'factura':
                limpiarFactura();
                break;
            case 'notaCredito':
                limpiarNotaCredito();
                break;
            case 'retencion':
                limpiarRetencion();
                break;
            default:
                break;
        }
    }
    const handleImprimirPDF = () => {
        switch (tipoComprobante) {
            case 'factura':
                dispatch(startObtenerPdf(claveAcceso));
                limpiarFactura();
                break;
            case 'notaCredito':
                dispatch(startObtenerPdfNotaCredito(claveAcceso));
                limpiarNotaCredito();
                break;
            case 'retencion':
                dispatch(startObtenerPdfRetencion(claveAcceso));
                limpiarRetencion();
                break;
            default:
                break;
        }
    }

    const limpiarFactura = () => {
        dispatch(startLimpiarDatosFactura());
        dispatch(startLimpiarSeleccion());
        history.push('/emitidas');
    }
    const limpiarNotaCredito = () => {
        dispatch(startLimpiarDatosNotaCredito());
        history.push('/notasCredito');
    }
    const limpiarRetencion = () => {
        dispatch(startLimpiarDatosRetencion());
        dispatch(startLimpiarSeleccion());
        history.push('/retenciones');
    }
    return (
        <>
            <div 
                className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-10/12 md:w-8/12 lg:w-5/12 my-6 pb-2 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                        <h3 className="text-2xl font-semibold">
                            Imprimir Comprobante
                        </h3>
                        <button
                            className="p-1 ml-auto border-0 text-black float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                            onClick={handleCerrar}
                        >
                            <span className="bg-transparent text-black h-6 w-6 text-lg block outline-none focus:outline-none">
                            x
                            </span>
                        </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto">
                            <div className="relative p-6 flex-auto">
                                <span>Comprobante emitido correctamente, desea imprimirlo?</span>
                            </div>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                type="button"
                                style={{ transition: "all .15s ease" }}
                                onClick={handleCerrar}
                            >
                                No
                            </button>
                            <button
                                className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                type="button"
                                style={{ transition: "all .15s ease" }}
                                onClick={handleImprimirPDF}
                            >
                                Si
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}
