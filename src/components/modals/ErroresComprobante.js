import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startLimpiarError } from '../../actions/comprobante';

export const ErroresComprobante = () => {
    const { errorDevuelta } = useSelector(state => state.comprobante);
    const { mensaje, informacionAdicional } = errorDevuelta;
    const dispatch = useDispatch();
    const handleCerrar = () => {
        dispatch(startLimpiarError());
    }
    return (
        <>
            <div 
                className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                // onClick={() => setShowModal(false)}
            >
                <div className="relative w-10/12 md:w-8/12 lg:w-5/12 my-6 pb-2 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                        <h3 className="text-2xl font-semibold">
                            Errores comprobante
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
                        <div className="relative p-6 flex flex-col">
                        <strong className="font-semibold">{mensaje}</strong>
                        {
                            informacionAdicional && <span className="mt-4 font-light"> {informacionAdicional}</span>
                        }
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                        <button
                            className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                            style={{ transition: "all .15s ease" }}
                            onClick={handleCerrar}
                        >
                            Cerrar
                        </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}
