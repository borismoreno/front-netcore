import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { startObtenerAutorizacionComprobante, startObtenerDetallesFactura, startObtenerError, startReenviarMail } from '../../actions/comprobante';
import { Cargando } from '../ui/Cargando';
import { MenuDescargar } from './MenuDescargar';
import { ReenvioMail } from '../modals/ReenvioMail';
import { NuevoPago } from '../modals/NuevoPago';
import { MenuAccionesFactura } from './MenuAccionesFactura';
import Confirmacion from '../modals/Confirmacion';
import { startEliminarPago } from '../../actions/factura';

export const FacturaDetalleScreen = () => {
    const { comprobantesEmitidos, detallesComprobante, descargandoPdf, errorDevuelta, autorizacionComprobante, claveReenvio } = useSelector(state => state.comprobante);
    const { mostrarCargando } = useSelector(state => state.alerta);
    const [ mostrarPago, setMostrarPago ] = useState(false);
    const [ mostrarConfirmacion, setMostrarConfirmacion ] = useState(false);
    const [ totalPagos, setTotalPagos ] = useState(0);
    const [ pendientePago, setPendientePago ] = useState(0);
    const [ indiceBorrar, setIndiceBorrar ] = useState(null);
    const dispatch = useDispatch();
    const params = useParams();
    const { id } = params;
    const elemento = comprobantesEmitidos.find(item => item._id === id);
    useEffect(() => {
        const procesarPagos = () => {
            const sumaPagos = elemento.pagosRegistrados.reduce((prev, cur) => {
                return prev + Number(cur.valor);
            }, 0);
            const sumaPendiente = Number(elemento.importeTotal) - sumaPagos;
            setTotalPagos(sumaPagos);
            setPendientePago(sumaPendiente);
        }
        procesarPagos();
    }, [elemento])
    useEffect(() => {
        dispatch(startObtenerDetallesFactura(id));
        if (elemento) {
            if (elemento.estadoComprobante === 'DEV') {
                dispatch(startObtenerError(id));
            } else {
                dispatch(startObtenerAutorizacionComprobante(id));
            }
        }
    }, [dispatch, id, elemento]);
    if (!elemento) {
        return <p>Error al consultar el comprobante</p>
    }
    const obtenerFecha = (fecha) => {
        const division = fecha.split('/');
        
        return `${obtenerMes(division[1])} ${division[0]}, ${division[2]}`;
    }

    const obtenerMes = (mesNumero) => {
        let mes = '';
        switch (mesNumero) {
            case '01':
                mes = 'Enero'
                break;
            case '02':
                mes = 'Febrero'
                break;
            case '03':
                mes = 'Marzo'
                break;
            case '04':
                mes = 'Abril'
                break;
            case '05':
                mes = 'Mayo'
                break;
            case '06':
                mes = 'Junio'
                break;
            case '07':
                mes = 'Julio'
                break;
            case '08':
                mes = 'Agosto'
                break;
            case '09':
                mes = 'Septiembre'
                break;
            case '10':
                mes = 'Octubre'
                break;
            case '11':
                mes = 'Noviembre'
                break;
            case '12':
                mes = 'Diciembre'
                break;
            default:
                break;
        }
        return mes;
    }
    const obtenerValorEstado = (valor) => {
        let estado = '';
        switch (valor) {
            case 'PPR':
                estado = 'POR PROCESAR'
                break;
            case 'AUT':
                estado = 'AUTORIZADO'
                break;
            case 'NAT':
                estado = 'NO AUTORIZADO'
                break;
            case 'REC':
                estado = 'RECIBIDA'
                break;
            case 'EMA':
                estado = 'PROCESADA'
                break;
            case 'DEV':
                estado = 'DEVUELTA'
                break;
            case 'ANU':
                estado = 'ANULADA'
                break;
            default:
                break;
        }
        return estado;
    }
    const estadoCmp = obtenerValorEstado(elemento.estadoComprobante);
    const fechaDescripcion = obtenerFecha(elemento.fechaEmision);

    const cambiarFecha = (fecha, incluirHora = false) => {
        const auxiliar = fecha.split('T');
        const division = auxiliar[0].split('-');
        const hora = auxiliar[1].split(':');
        if (incluirHora) {
            return `${obtenerMes(division[1])} ${division[2]}, ${division[0]}, ${hora[0]}:${hora[1]}`
        } else {
            return `${obtenerMes(division[1])} ${division[2]}, ${division[0]}`
        }
    }

    const handleReenvioMail = (claveAcceso) => {
        dispatch(startReenviarMail(claveAcceso));
    }

    const handlePresentarConfirmacion = (indice) => {
        setIndiceBorrar(indice);
        setMostrarConfirmacion(true);
    }

    const handleEliminarPago = () => {
        setMostrarConfirmacion(false);
        dispatch(startEliminarPago({
            indice: indiceBorrar,
            facturaId: id
        }));
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
                            to="/emitidas"
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
                                        onClick={() => setMostrarPago(true)}
                                    >
                                        <i className="fas fa-dollar-sign md:mr-2"></i>
                                        <p className="hidden md:block">Pago</p>
                                    </button>
                                    <button 
                                        type="button" 
                                        className="flex items-center p-2 rounded-md border border-gray-400 shadow-md mr-2 hover:bg-gray-100 focus:outline-none text-gray-900"
                                        onClick={() => setMostrarPago(true)}
                                    >
                                        <i className="fas fa-file-signature md:mr-2"></i>
                                        <p className="hidden md:block">Retención</p>
                                    </button>
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
                        <p className='text-2xl font-light'>Factura {elemento.estab}-{elemento.ptoEmi}-{elemento.secuencial}</p>
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
                    <p className='capitalize text-lg font-light text-blue-400'>{elemento.razonSocialComprador.toLowerCase()}</p>
                    <p className='text-sm font-light text-gray-600 mt-2'>Cedula {elemento.identificacionComprador}</p>
                    <p className='text-sm font-light text-gray-600'>{elemento.cliente.mail}</p>
                    <p className='text-sm font-light text-gray-600'>{elemento.cliente.direccion}</p>
                    <p className='text-sm font-light text-gray-600'>Telf. {elemento.cliente.telefono}</p>
                </div>
                <hr className='mt-4 mx-2 border-gray-400' />
                <div className="block w-full overflow-x-auto px-2 mt-4">
                    {/* <table className="w-full mt-4"> */}
                    <table className="items-center w-full border-collapse mt-4">
                        <thead>
                            <tr>
                                <th
                                    className='md:w-2/6 border-b-2 border-gray-300 py-2 font-light text-gray-900'
                                >Descripción</th>
                                <th
                                    className='md:w-1/6 border-b-2 border-gray-300 py-2 font-light text-gray-900'
                                >Cantidad</th>
                                <th
                                    className='md:w-1/6 border-b-2 border-gray-300 py-2 font-light text-gray-900'
                                >Precio Unitario</th>
                                <th
                                    className='md:w-1/6 border-b-2 border-gray-300 py-2 font-light text-gray-900'
                                >Descuento</th>
                                <th
                                    className='md:w-1/6 border-b-2 border-gray-300 py-2 font-light text-gray-900'
                                >Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-600 text-sm font-light'>
                            {
                                detallesComprobante.map(detalle => {
                                    return <tr key={detalle._id} className='border-b border-gray-200 hover:border-gray-100'>
                                        <td
                                            className='py-3 px-6 text-left'
                                        >
                                            <div>
                                                {detalle.descripcion}
                                            </div>
                                        </td>
                                        <td
                                            className='text-center'
                                        >{detalle.cantidad}</td>
                                        <td
                                            className='text-center'
                                        >$ {detalle.precioUnitario}</td>
                                        <td
                                            className='text-center'
                                        >$ {detalle.descuento}</td>
                                        <td
                                            className='text-center'
                                        >$ {detalle.totalSinImpuesto}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className='flex justify-end'>
                    <div className='w-full md:w-1/2 flex justify-between p-2'>
                        <div className='w-full'>
                            <p className='text-lg font-light p-2'>Subtotal</p>
                            <p className='text-lg font-light p-2'>Valor IVA</p>
                            <p className='text-3xl font-light p-2'>Total</p>
                        </div>
                        <div className='w-full'>
                            <p className='text-lg font-light p-2 text-right'>$ {elemento.totalSinImpuestos}</p>
                            <p className='text-lg font-light p-2 text-right'>$ {elemento.totalIva}</p>
                            <p className='text-3xl font-light p-2 text-right'>$ {elemento.importeTotal}</p>
                        </div>
                    </div>
                </div>
                
                {
                    (descargandoPdf || mostrarCargando) && <Cargando />
                }
                {
                    claveReenvio && <ReenvioMail claveAcceso={claveReenvio} tipoDocumento='comprobante' />
                }
                {
                    mostrarPago && 
                        <NuevoPago 
                            valorInicial={pendientePago} 
                            setShowModal={setMostrarPago}
                            facturaId={elemento._id}
                        />
                }
                {
                    mostrarConfirmacion && <Confirmacion handleBorrar={handleEliminarPago} handleCerrar={setMostrarConfirmacion} mensajeConfirmacion="¿Seguro de borrar este pago?"/>
                }
            </div>
            <div className='flex flex-col border-2 mb-10'>
                <div className='mt-5 ml-5'>
                    <p className='text-gray-500 text-lg'>Saldos</p>
                </div>
                <div className='flex flex-col md:flex-row p-6 justify-around'>
                    <div className='w-full flex flex-col items-center my-10'>
                        <p className='text-3xl text-gray-600 font-light'>${ totalPagos.toFixed(2) }</p>
                        <p className='text-xl text-gray-500'>TOTAL PAGADO</p>
                    </div>
                    <div className='w-full flex flex-col items-center my-10'>
                        <p className='text-3xl text-gray-600 font-light'>${ pendientePago.toFixed(2) }</p>
                        <p className='text-xl text-gray-500'>SALDO PENDIENTE</p>
                    </div>
                </div>
                <div className={`${elemento.pagosRegistrados.length === 0 ? 'hidden': 'block'} w-full overflow-x-auto px-2 mt-4`}>
                    {/* <table className="w-full mt-4"> */}
                    <table className="items-center w-full border-collapse mt-4 mb-4">
                        <thead className="py-5">
                            <tr>
                                <th
                                    className='md:w-5/12 border-b-2 border-gray-300 py-2 font-light text-xl text-gray-800'
                                >Forma Pago</th>
                                <th
                                    className='md:w-3/12 border-b-2 border-gray-300 py-2 font-light text-xl text-gray-800'
                                >Fecha</th>
                                <th
                                    className='md:w-3/12 border-b-2 border-gray-300 py-2 font-light text-xl text-gray-800'
                                >Valor</th>
                                <th
                                    className='md:w-1/12 border-b-2 border-gray-300 py-2 font-light text-xl text-gray-800'
                                >
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-600 text-sm font-light'>
                            {
                                elemento.pagosRegistrados.map((pago, index) => {
                                    return <tr key={index} className='border-b border-gray-200 hover:border-gray-100'>
                                        <td
                                            className='py-3 px-6 text-center'
                                        >
                                            <div>
                                                {pago.formaPagoDescripcion}
                                            </div>
                                        </td>
                                        <td
                                            className='text-center'
                                        >{ cambiarFecha(pago.fechaPago, false)}</td>
                                        <td
                                            className='text-center'
                                        >${Number(pago.valor).toFixed(2)}</td>
                                        <td
                                            className='text-center'
                                        >
                                            <button 
                                                className='has-tooltip focus:outline-none md:mr-4'
                                                onClick={()=> handlePresentarConfirmacion(index)}
                                            >
                                                <span className='tooltip text-xs rounded shadow-lg px-5 py-2 bg-gray-200 text-gray-600 -mt-8 -ml-8'>Eliminar</span>
                                                <i className="fas fa-trash text-red-400 hover:text-red-800"></i>
                                            </button>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
