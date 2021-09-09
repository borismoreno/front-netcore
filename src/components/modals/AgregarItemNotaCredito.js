import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startAgregarDetalle } from '../../actions/notaCredito';

const AgregarItemNotaCredito = ({setMostrarModal, detalleId}) => {
    const dispatch = useDispatch();
    const { detallesComprobante } = useSelector(state => state.comprobante);
    const [ detalleFactura, setDetalleFactura ] = useState({});
    const handleClick = () => {
        dispatch(startAgregarDetalle(detalleFactura));
        setMostrarModal(false);
    }
    useEffect(() => {
        setDetalleFactura(detallesComprobante.find( detalle => detalle._id === detalleId ))
    }, [detallesComprobante, detalleId]);
    return ( 
        <>
            <div 
            className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            // onClick={() => setShowModal(false)}
         >
            <div className="relative w-11/12 md:w-8/12 my-auto pb-2">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-2xl font-semibold">
                    Ajuste los valores
                  </h3>
                  <button
                    className="p-1 ml-auto border-0 text-black float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setMostrarModal(false)}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-lg block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                {
                    detalleFactura.impuestoDetalle && 
                    <>
                        <div className="relative p-6 flex flex-col md:flex-row md:justify-between">
                            <div className='w-full flex flex-col md:flex-row md:justify-between p-2'>
                                <div className='w-full md:w-2/4 flex flex-col p-2'>
                                    <p>Cantidad</p>
                                    <input
                                        className='w-full border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 text-sm text-gray-500 mt-2'
                                        autoComplete='off'
                                        placeholder={detalleFactura.cantidad}
                                        name="cantidad"
                                        type="number"
                                        min="0"
                                        max={detalleFactura.cantidad}
                                        value={detalleFactura.cantidad}
                                        readOnly={true}
                                        // onChange={handleInputChange}
                                    />
                                </div>
                                <div className='w-full md:w-2/4 flex flex-col p-2'>
                                    <p>Código</p>
                                    <input
                                        className='w-full border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 text-sm text-gray-500 mt-2'
                                        autoComplete='off'
                                        value={detalleFactura.codigoPrincipal}
                                        readOnly={true}
                                        // onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className='w-full  flex flex-col md:flex-row md:justify-between p-2'>
                                <div className='w-full md:w-2/4 flex flex-col p-2'>
                                    <p>Valor Unitario</p>
                                    <input
                                        className='w-full border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 text-sm text-gray-500 mt-2'
                                        autoComplete='off'
                                        value={`$ ${detalleFactura.precioUnitario}`}
                                        readOnly={true}
                                        // onChange={handleInputChange}
                                    />
                                </div>
                                <div className='w-full md:w-2/4 flex flex-col p-2'>
                                    <p>Tarifa Impuesto</p>
                                    <input
                                        className='w-full border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 text-sm text-gray-500 mt-2'
                                        autoComplete='off'
                                        value={`${detalleFactura.impuestoDetalle[0].tarifa} %`}
                                        readOnly={true}
                                        // onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="relative px-6 flex flex-col md:flex-row md:justify-between">
                            <div className='w-full md:w-1/2 flex flex-col md:flex-row md:justify-between p-2'>
                                <div className='w-full flex flex-col p-2'>
                                    <p>Descripción</p>
                                    <input
                                        className='w-full border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 text-sm text-gray-500 mt-2'
                                        autoComplete='off'
                                        value={detalleFactura.descripcion}
                                        readOnly={true}
                                        // onChange={handleInputChange}
                                    />
                                </div>
                                
                            </div>
                        </div>
                    </>
                }
                
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-gray-300 rounded-b">
                  
                  <button
                    className="bg-blue-500 text-white hover:bg-blue-600 uppercase font-light text-sm px-6 py-2 rounded-3xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={handleClick}
                  >
                    Agregar
                  </button>
                  <button
                    className="bg-red-500 text-white hover:bg-red-600 font-light uppercase text-sm px-6 py-2 rounded-3xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
     );
}
 
export default AgregarItemNotaCredito;