import React from 'react';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { obtenerValorEstado } from '../../../helpers/comunes';
import { MenuDescargar } from '../MenuDescargar';
import { MenuAccionesFactura } from '../MenuAccionesFactura';

const NotaCreditoDetalleScreen = () => {
    const { notasCreditoEmitidas } = useSelector(state => state.notaCredito);
    const params = useParams();
    const { id } = params;
    const elemento = notasCreditoEmitidas.find(item => item._id === id);
    console.log(elemento);
    const estadoCmp = obtenerValorEstado(elemento.estadoComprobante);
    return (
        <>
            <div
                className="container mx-auto mb-6 border-2 rounded-t-md pb-4"
            >
                <div className="flex justify-between py-2 px-3 bg-gray-200 rounded-md rounded-b-none">
                    <div className=''>
                        <NavLink
                            className="flex items-center p-2 rounded-md border border-gray-400 shadow-md hover:bg-gray-100 focus:outline-none text-gray-900"
                            to="/notasCredito"
                        >
                            <i className="fas fa-arrow-circle-left md:mr-2"></i>
                            <p className="hidden md:block">Regresar</p>
                        </NavLink>
                    </div>
                    <div className='justify-end'>
                        <div className="flex">
                            {
                                estadoCmp === 'PROCESADA' &&
                                <>
                                    <button 
                                        type="button" 
                                        className="flex items-center p-2 rounded-md border border-gray-400 shadow-md mr-2 hover:bg-gray-100 focus:outline-none text-gray-900"
                                        // onClick={() => handleReenvioMail(elemento.claveAcceso)}
                                    >
                                        <i className="far fa-envelope md:mr-2"></i>
                                        <p className="hidden md:block">Enviar</p>
                                    </button>
                                </>
                            }
                            <MenuDescargar
                                claveAcceso={elemento.claveAcceso}
                                tieneXml={elemento.pathXml ? true: false}
                            />
                            <MenuAccionesFactura
                                
                            />
                        </div>
                    </div>
                </div>
                <div className='pr-3'>
                    <div className='flex justify-end mt-3'>
                        <p className={
                                'py-2 px-4 text-sm font-medium border-2 rounded-md ' + 
                                ((estadoCmp === 'PROCESADA') ? ' border-green-400 text-green-400' : ' border-red-400 text-red-400')
                            }>{estadoCmp}</p>
                    </div>
                    <div className='flex justify-end mt-3'>
                        <p className='text-2xl font-light'>Nota Crédito {elemento.estab}-{elemento.ptoEmi}-{elemento.secuencial}</p>
                    </div>
                    <div className='flex justify-end mt-3'>
                        {/* <p className='text-2xl font-thin'>{fechaDescripcion}</p> */}
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default NotaCreditoDetalleScreen;