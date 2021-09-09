import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { obtenerValorEstado, obtenerFecha, cambiarFecha } from '../../../helpers/comunes';
import { MenuAccionesFactura } from '../MenuAccionesFactura';
import { MenuDescargar } from '../MenuDescargar';
import { Cargando } from '../../ui/Cargando';
import { startObtenerAutorizacionComprobante, startObtenerError, startReenviarMail } from '../../../actions/comprobante';
import { startObtenerDetallesRetencion } from '../../../actions/retencion';
import { ReenvioMail } from '../../modals/ReenvioMail';

const RetencionDetalleScreen = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const { id } = params;
    const [ totalRetenido, setTotalRetenido ] = useState(0);
    const [ datosDocumento, setDatosDocumento ] = useState({
        codDocSustento: '',
        numDocSustento: '',
        fechaEmisionDocSustento: ''
    });
    const { retencionesEmitidas, detallesEmitida } = useSelector(state => state.retencion);
    const { descargandoPdf, autorizacionComprobante, claveReenvio, errorDevuelta } = useSelector(state => state.comprobante);
    const elemento = retencionesEmitidas.find(item => item._id === id);
    const { mostrarCargando } = useSelector(state => state.alerta);
    const estadoCmp = obtenerValorEstado(elemento.estadoComprobante);
    const fechaDescripcion = obtenerFecha(elemento.fechaEmision);
    useEffect(() => {
        dispatch(startObtenerDetallesRetencion(id));
        if (elemento) {
            if (elemento.estadoComprobante === 'DEV') {
                dispatch(startObtenerError(id));
            } else {
                dispatch(startObtenerAutorizacionComprobante(id));
            }
        }
    }, [dispatch, id, elemento]);
    useEffect(() => {
        setTotalRetenido(detallesEmitida.reduce((acumulado, actual) => acumulado + Number(actual.valorRetenido), 0));
        if(detallesEmitida.length > 0) {
            setDatosDocumento({
                codDocSustento: (detallesEmitida[0].codDocSustento === '01' ? 'FACTURA': null),
                numDocSustento: detallesEmitida[0].numDocSustento,
                fechaEmisionDocSustento: detallesEmitida[0].fechaEmisionDocSustento,
            })
        }
    }, [detallesEmitida]);
    if (!elemento) {
        return <p>Error al consultar el comprobante</p>
    }
    const handleReenvioMail = (claveAcceso) => {
        dispatch(startReenviarMail(claveAcceso));
    }
    return ( 
        <>
            <div
                className="container mx-auto mb-6 border-2 rounded-t-md pb-4"
            >
                <div className="flex justify-between py-2 px-3 bg-gray-200 rounded-md rounded-b-none">
                    <div className=''>
                        <NavLink
                            className="flex items-center p-2 rounded-md border border-gray-400 shadow-md hover:bg-gray-100 focus:outline-none text-gray-900"
                            to="/retenciones"
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
                                        onClick={() => handleReenvioMail(elemento.claveAcceso)}
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
                        <p className='text-2xl font-light'>Comprobante {elemento.estab}-{elemento.ptoEmi}-{elemento.secuencial}</p>
                    </div>
                    <div className='flex justify-end mt-3'>
                        <p className='text-2xl font-thin'>{fechaDescripcion}</p>
                    </div>
                </div>
                {
                    errorDevuelta && 
                    <div className='border-2 border-red-100 rounded-md p-2 mt-4 shadow-md mb-4 bg-gray-100 mx-4'>
                        <div>
                            <p className='text-xl font-light mb-2 text-red-500'>Mensaje devuelto por el SRI</p>
                            <p className='text-sm font-light py-2'><strong>Código: </strong>{errorDevuelta.identificador}</p>
                            <p className='text-base font-light'>{errorDevuelta.mensaje}</p>
                            {errorDevuelta.informacionAdicional !== '' && <p className='text-base font-light pt-2'>{errorDevuelta.informacionAdicional}</p>}
                        </div>
                    </div>
                }
                <div className='flex flex-col flex-wrap lg:flex-row content-center lg:justify-between mt-3 lg:px-2'>
                    <div className='w-11/12 lg:w-5/12'>
                        <p className='capitalize text-lg font-light text-gray-800'>{elemento.razonSocial.toLowerCase()}</p>
                        <p className='text-sm font-light text-gray-600 mt-4'>RUC {elemento.ruc}</p>
                        <p className='text-sm font-light text-gray-600'>{elemento.dirEstablecimiento}</p>
                    </div>
                    <hr className='mt-4 border-gray-400 lg:hidden' />
                    <div className='mt-4 lg:mt-0 w-11/12 lg:w-6/12'>
                        { autorizacionComprobante && <div>
                            <p className='capitalize text-lg font-light text-gray-800'>Autorización</p>
                            <p className='capitalize text-sm font-light text-gray-800 mt-4'>Número</p>
                            <p className='text-xs xl:text-sm font-light text-gray-600 mt-1'>{autorizacionComprobante.numeroAutorizacion}</p>
                            <p className='capitalize text-sm font-light text-gray-800 mt-2'>Fecha</p>
                            <p className='text-xs xl:text-sm font-light text-gray-600 mt-1'>{cambiarFecha(autorizacionComprobante.fechaAutorizacion, true)}</p>
                        </div>}
                    </div>
                </div>
                <hr className='mt-4 mx-2 border-gray-400' />
                <div className='flex flex-col mt-4 px-2'>
                    <p className='capitalize text-lg font-light text-blue-400'>{elemento.razonSocialSujetoRetenido.toLowerCase()}</p>
                    <p className='text-sm font-light text-gray-600 mt-2'>Cedula {elemento.identificacionSujetoRetenido}</p>
                    <p className='text-sm font-light text-gray-600'>{elemento.cliente.mail}</p>
                    <p className='text-sm font-light text-gray-600'>{elemento.cliente.direccion}</p>
                    <p className='text-sm font-light text-gray-600'>Telf. {elemento.cliente.telefono}</p>
                </div>
                <hr className='mt-4 mx-2 border-gray-400' />
                <div className='mt-4 px-2'>
                    <p className='capitalize text-lg font-light text-gray-800'>Documento Sustento</p>
                    <div className='flex flex-row'>
                        <div className='w-1/4'>
                            <p className='capitalize text-sm font-light text-gray-800 mt-2'>Tipo Comprobante</p>
                            <p className='text-xs xl:text-sm font-light text-gray-600 mt-1'>{datosDocumento.codDocSustento}</p>
                        </div>
                        <div className='w-1/4'>
                            <p className='capitalize text-sm font-light text-gray-800 mt-2'>Número Comprobante</p>
                            <p className='text-xs xl:text-sm font-light text-gray-600 mt-1'>{datosDocumento.numDocSustento}</p>
                        </div>
                        <div className='w-1/4'>
                            <p className='capitalize text-sm font-light text-gray-800 mt-2'>Fecha Emisión</p>
                            <p className='text-xs xl:text-sm font-light text-gray-600 mt-1'>{datosDocumento.fechaEmisionDocSustento}</p>
                        </div>
                        <div className='w-1/4'>
                            <p className='capitalize text-sm font-light text-gray-800 mt-2'>Período Fiscal</p>
                            <p className='text-xs xl:text-sm font-light text-gray-600 mt-1'>{elemento.periodoFiscal}</p>
                        </div>
                    </div>
                </div>
                <hr className='mt-4 mx-2 border-gray-400' />
                <div className="block w-full overflow-x-auto px-2 mt-4">
                    {/* <table className="w-full mt-4"> */}
                    <table className="items-center w-full border-collapse mt-4">
                        <thead>
                            <tr>
                                <th
                                    className='md:w-1/5 border-b-2 border-gray-300 py-2 font-light text-gray-900'
                                >Tipo</th>
                                <th
                                    className='md:w-1/5 border-b-2 border-gray-300 py-2 font-light text-gray-900'
                                >Código</th>
                                <th
                                    className='md:w-1/5 border-b-2 border-gray-300 py-2 font-light text-gray-900'
                                >Porcentaje</th>
                                <th
                                    className='md:w-1/5 border-b-2 border-gray-300 py-2 font-light text-gray-900'
                                >Valor Retenido</th>
                                <th
                                    className='md:w-1/5 border-b-2 border-gray-300 py-2 font-light text-gray-900'
                                >Base Imponible</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-600 text-sm font-light'>
                            {
                                detallesEmitida.map(detalle => {
                                    return <tr key={detalle._id} className='border-b border-gray-200 hover:border-gray-100'>
                                        <td
                                            className='py-3 px-6 text-center'
                                        >
                                            {detalle.codigo}
                                        </td>
                                        <td
                                            className='text-center'
                                        >{detalle.codigoRetencion}</td>
                                        <td
                                            className='text-center'
                                        >{detalle.porcentajeRetener} %</td>
                                        <td
                                            className='text-center'
                                        >$ {detalle.baseImponible}</td>
                                        <td
                                            className='text-center'
                                        >$ {detalle.valorRetenido}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className='flex mt-6'>
                    <div className='w-full md:w-1/2 flex justify-between p-2'>
                        <div className='w-full'>
                            <p className='text-3xl font-light p-2'>Total Retenido</p>
                        </div>
                        <div className='w-full'>
                            <p className='text-3xl font-light p-2 text-right'>$ {totalRetenido}</p>
                        </div>
                    </div>
                </div>
                {
                    (descargandoPdf || mostrarCargando) && <Cargando />
                }
                {
                    claveReenvio && <ReenvioMail claveAcceso={claveReenvio} tipoDocumento='retencion' />
                }
            </div>
        </>
     );
}
 
export default RetencionDetalleScreen;