import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { startMostrarCargandoAlerta, startMostrarError } from '../../../actions/alerta';
import { startObtenerDetallesFactura } from '../../../actions/comprobante';
import { startObtenerDatosEmpresa } from '../../../actions/configuracion';
import { startActualizarAdicionales } from '../../../actions/factura';
import { startEliminarDetalle, startEmitirNotaCredito } from '../../../actions/notaCredito';
import { calcularImpuestosDetalle } from '../../../helpers/calculos';
import AgregarItemNotaCredito from '../../modals/AgregarItemNotaCredito';
import { ImprimirComprobante } from '../../modals/ImprimirComprobante';
import { NuevoAdicional } from '../../modals/NuevoAdicional';
import { Cargando } from '../../ui/Cargando';
import { SeleccionFecha } from '../../ui/SeleccionFecha';
import { Tabla } from '../../ui/Tabla';
import ValoresNotaCredito from './ValoresNotaCredito';

const headersAdicional = [
    'Nombre',
    'Valor',
    ''
]

const NotaCreditoScreen = ({history}) => {
    const params = useParams();
    const { id } = params;
    const dispatch = useDispatch();
    const [ facturaProcesada, setFacturaProcesada ] = useState({});
    const [ fechaEmision, setFechaEmision ] = useState(new Date());
    const [ motivo, setMotivo ] = useState('Devolución');
    const [ mostrarModal, setMostrarModal ] = useState(false);
    const [ mostrarNuevoAdicional, setMostrarNuevoAdicional ] = useState(false);
    const [ detalleId, setDetalleId ] = useState('');
    const { facturasProcesadas, detallesComprobante } = useSelector(state => state.comprobante);
    const { mostrarCargando } = useSelector(state => state.alerta);
    const { empresaId } = useSelector(state => state.auth);
    const { empresa } = useSelector(state => state.configuracion);
    const { adicionalesFactura } = useSelector(state => state.factura);
    const { detallesNotaCredito, valoresNotaCredito, claveAcceso } = useSelector(state => state.notaCredito);
    const { 
        subtotalDoce, 
        subtotalCero, 
        subtotalNoIva, 
        subtotalExento, 
        subtotalSinImpuestos, 
        totalIva,
        valorTotal 
    } = valoresNotaCredito;
    const handleEliminarAdicional = (index) => {
        dispatch(startActualizarAdicionales(adicionalesFactura.filter((item, i) => {
            return index !== i
        })));
    }
    const handleInputChange = (e) => {
        setMotivo(e.target.value);
    }
    const handleClick = (id) => {
        const encontrada = detallesNotaCredito.find( detalle => detalle._id === id );
        if (encontrada) {
            dispatch(startMostrarError(`Ya se ha añadido un detalle para el producto con código ${encontrada.codigoPrincipal}.`));
            return;
        }
        setDetalleId(id);
        setMostrarModal(true);
    }
    const handleDelete = (id) => {
        dispatch(startEliminarDetalle(id));
    }

    const handleEmitirNotaCredito = () => {
        let dd = fechaEmision.getDate();
        let mm = fechaEmision.getMonth()+1; //January is 0!
        let yyyy = fechaEmision.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        }
        const fechaEnvio = yyyy+'-'+mm+'-'+dd;
        let impuestosDetalle =[];
        if ( subtotalDoce > 0 ) {
            impuestosDetalle.push(calcularImpuestosDetalle(subtotalDoce, totalIva, '2', '0.00'));
        }
        if ( subtotalCero > 0 ) {
            impuestosDetalle.push(calcularImpuestosDetalle(subtotalCero, '0.00', '0', '0.00'));
        }
        if ( subtotalNoIva > 0 ) {
            impuestosDetalle.push(calcularImpuestosDetalle(subtotalNoIva, '0.00', '6', '0.00'));
        }
        if ( subtotalExento > 0 ) {
            impuestosDetalle.push(calcularImpuestosDetalle(subtotalExento, '0.00', '7', '0.00'));
        }
        if (detallesNotaCredito.length === 0) {
            dispatch(startMostrarError('No hay detalles para emitir la nota de crédito'));
            return;
        }
        detallesNotaCredito.map(detalle => {
            return detalle.descripcion = detalle.descripcion.replace(/(\r\n|\n|\r)/gm, " ");
        });
        dispatch(startMostrarCargandoAlerta());
        dispatch(startEmitirNotaCredito({
            empresa,
            fechaEmision: fechaEnvio,
            detallesNotaCredito,
            impuestosDetalle,
            facturaId: id,
            motivo,
            datosAdicionales: adicionalesFactura,
            detallesValores: {
                totalSinImpuestos: subtotalSinImpuestos.toFixed(2),
                totalDescuento: '0.00',
                totalIva,
                importeTotal: valorTotal.toFixed(2)
            }
        }))
    }
    useEffect(() => {
        setFacturaProcesada(facturasProcesadas.find( factura => factura._id === id ));
        dispatch(startObtenerDetallesFactura(id));
    }, [id, facturasProcesadas, dispatch]);
    useEffect(() => {
        dispatch(startObtenerDatosEmpresa(empresaId));
    }, [empresaId, dispatch])
    return ( 
        <div
            className="container mx-auto mb-6 border p-4"
        >
            <div className="flex justify-between py-2 px-3 bg-transparent rounded-md rounded-b-none">
                <h2 className="text-2xl font-bold mt-1 tracking-wider uppercase">Nota Crédito</h2>
                <div className="">
                    <div className="relative inline-block">
                        <NavLink
                            className="flex items-center p-2 hover:bg-gray-100 focus:outline-none text-blue-400"
                            to="/notasCredito"
                        >
                            <i className="fas fa-arrow-circle-left mr-2"></i>
                            <p className="">Regresar al listado</p>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className='bg-gray-200 px-2 pt-4 mt-4'>
                <p>Datos documento sustento</p>
            </div>
            <div className='flex flex-col md:flex-row justify-between p-4 border border-gray-200'>
                <div className='w-full flex flex-col'>
                    <div>
                        <span className='text-base font-semibold text-gray-500'>Factura</span>
                    </div>
                    <div>
                        <span className='text-sm font-light text-gray-500'>{ `${facturaProcesada.estab}-${facturaProcesada.ptoEmi}-${facturaProcesada.secuencial}` }</span>
                    </div>
                </div>
                <div className='w-full flex flex-col'>
                    <div>
                        <span className='text-base font-semibold text-gray-500'>Fecha de emisión</span>
                    </div>
                    <div>
                        <span className='text-sm font-light text-gray-500'>{ facturaProcesada.fechaEmision }</span>
                    </div>
                </div>
                <div className='w-full flex flex-col'>
                    <div>
                        <span className='text-base font-semibold text-gray-500'>Cliente</span>
                    </div>
                    <div>
                        <span className='text-sm font-light text-gray-500'>{ facturaProcesada.razonSocialComprador }</span>
                    </div>
                </div>
            </div>
            <div className='bg-gray-200 px-2 pt-4 mt-8'>
                <p>Datos nota de crédito</p>
            </div>
            <div className='flex flex-col md:flex-row justify-between p-4 border border-gray-200'>
                <div className='w-full flex flex-col px-4'>
                    <div>
                        <span className='text-base font-semibold text-gray-500'>Fecha</span>
                    </div>
                    <div className='flex flex-col pr-4'>
                        <SeleccionFecha
                            startDate={fechaEmision}
                            setStartDate={setFechaEmision}
                        />
                    </div>
                </div>
                <div className='w-full flex flex-col px-4'>
                    <div>
                        <span className='text-base font-semibold text-gray-500'>Motivo</span>
                    </div>
                    <div className='flex flex-col mt-4'>
                        <input
                            className='w-full border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 text-sm text-gray-500'
                            autoComplete='off'
                            name='motivo'
                            value={motivo}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <div className='bg-gray-200 px-2 pt-4 mt-8 flex flex-col'>
                <p>Detalles Factura</p>
                <p className='mt-2 text-gray-400 font-light'>Seleccione los items que desea añadir</p>
                <div className='mt-4 p-6'>
                    <table className='items-center w-full bg-transparent border-collapse'>
                        <thead>
                            <tr className='border-b-2 border-gray-400'>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Cantidad</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Descripción</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Valor Unitario</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Valor Total</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                detallesComprobante.map(detalle => {
                                    return <tr
                                        key={detalle._id}
                                    >
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{detalle.cantidad}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{detalle.descripcion}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{`$ ${detalle.precioUnitario}`}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{`$ ${detalle.totalSinImpuesto}`}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-green-500'>
                                            <button
                                                className='focus:outline-none hover:text-green-800'
                                                onClick={() => handleClick(detalle._id)}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='bg-gray-200 px-2 pt-4 mt-8 flex flex-col'>
                <p>Detalles Nota Crédito</p>
                {/* <p className='mt-2 text-gray-400 font-light'>Seleccione los items que desea añadir</p> */}
                <div className='mt-4 p-6'>
                    <table className='items-center w-full bg-transparent border-collapse'>
                        <thead>
                            <tr className='border-b-2 border-gray-400'>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Cantidad</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Descripción</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Valor Unitario</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Valor Total</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                detallesNotaCredito.map(detalle => {
                                    return <tr
                                        key={detalle._id}
                                    >
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{detalle.cantidad}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{detalle.descripcion}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{`$ ${detalle.precioUnitario}`}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{`$ ${detalle.totalSinImpuesto}`}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-red-500'>
                                            <button
                                                className='focus:outline-none hover:text-red-800'
                                                onClick={() => handleDelete(detalle._id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-col flex-wrap md:flex-row mb-8 justify-between text-left mt-8">
                <div className="w-10/12 md:w-6/12 border-gray-200 border-2 rounded-md">
                    <Tabla
                        headers={headersAdicional}
                        data={adicionalesFactura}
                        handleEliminar={handleEliminarAdicional}
                    />
                    <button
                        className="flex items-center p-2 hover:bg-gray-100 focus:outline-none text-blue-400"
                        onClick={() => setMostrarNuevoAdicional(true)}
                    >
                        <i className="fas fa-plus-circle mr-2"></i>
                        <p className="">Agregar Valor Adicional</p>
                    </button>
                </div>
                <div className="w-10/12 md:w-5/12 border-gray-200 border-2 rounded-md pt-2">
                    <ValoresNotaCredito
                    />
                </div>
            </div>
            <div className="flex justify-center">
                <button 
                    className="bg-blue-500 uppercase rounded-3xl py-3 px-8 text-white mr-4 focus:outline-none"
                    onClick={handleEmitirNotaCredito} 
                >Enviar</button>
                <NavLink
                    className="bg-red-500 uppercase rounded-3xl py-3 px-8 text-white focus:outline-none"
                    to="/notasCredito"
                >Cancelar</NavLink>
            </div>
            {
                (mostrarModal && detalleId !== '') && <AgregarItemNotaCredito setMostrarModal={setMostrarModal} detalleId={detalleId} />
            }
            {
                mostrarNuevoAdicional && 
                <>
                    <NuevoAdicional
                        setShowModal={setMostrarNuevoAdicional}
                    />
                </>
            }
            {
                mostrarCargando && <Cargando />
            }
            {
                claveAcceso && <ImprimirComprobante claveAcceso={claveAcceso} history={history} tipoComprobante='notaCredito'/>
            }
        </div>
     );
}
 
export default NotaCreditoScreen;