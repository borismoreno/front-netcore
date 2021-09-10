import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startLimpiarSeleccion } from '../../actions/clientes';
import { startObtenerDatosEmpresa, startObtenerFormasPago, startObtenerTarifasIva, startObtenerTiposProducto } from '../../actions/configuracion';
import { startActualizarAdicionales, startActualizarDetallesFactura, startAgregarDetalle, startEmitirFactura, startLimpiarDatosFactura } from '../../actions/factura';
import { calcularImpuestosDetalle } from '../../helpers/calculos';
import { NuevoAdicional } from '../modals/NuevoAdicional';
import { SeleccionFecha } from '../ui/SeleccionFecha';
import { Tabla } from '../ui/Tabla';
import { ValoresFactura } from './ValoresFactura';
import { startMostrarCargandoAlerta, startMostrarError } from '../../actions/alerta';
import { Cargando } from '../ui/Cargando';
import { ImprimirComprobante } from '../modals/ImprimirComprobante';
import { NavLink } from 'react-router-dom';
import { TablaClientes } from '../modals/TablaClientes';
import TablaDetallesFactura from '../ui/TablaDetallesFactura';
import Autocomplete from '../ui/Autocomplete';
import NuevoProducto from '../modals/NuevoProducto';
import { startObtenerProductos } from '../../actions/producto';
import { EditarCliente } from '../modals/EditarCliente';

const headersAdicional = [
    'Nombre',
    'Valor',
    ''
]
export const FacturaScreen = ({history}) => {
    const dispatch = useDispatch();
    const [mostrarNuevoAdicional, setMostrarNuevoAdicional] = useState(false);
    const [mostrarClienteNuevo, setMostrarClienteNuevo] = useState(false);
    const [formasPresentar, setFormasPresentar] = useState([]);
    const [formaPago, setFormaPago] = useState('');
    const [plazoCredito, setPlazoCredito] = useState('');
    const [remarcar, setRemarcar] = useState(false);
    const [credito, setCredito] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [identificacionBusqueda, setIdentificacionBusqueda] = useState('');
    const [mostrarAgregar, setMostrarAgregar] = useState(false);
    const [fechaEmision, setFechaEmision] = useState(new Date());
    const { clienteSeleccionado, cerrarModalCliente } = useSelector(state => state.clientes);
    const { empresaId } = useSelector(state => state.auth);
    const { empresa, formasPago } = useSelector(state => state.configuracion);
    const { detallesFactura, adicionalesFactura, valoresFactura, claveAcceso, cerrarModal } = useSelector(state => state.factura);
    const { productos, productoNuevo } = useSelector(state => state.producto);
    const { mostrarCargando } = useSelector(state => state.alerta);
    const { 
        subtotalDoce, 
        subtotalCero, 
        subtotalNoIva, 
        subtotalExento, 
        subtotalSinImpuestos, 
        totalIva,
        valorTotal 
    } = valoresFactura;
    const pad = '000000000';

    useEffect(() => {
        dispatch(startObtenerFormasPago());
        dispatch(startObtenerProductos());
        dispatch(startObtenerTiposProducto());
        dispatch(startObtenerTarifasIva());
    }, [dispatch])

    useEffect(() => {
        const nuevoProd = () => {
            if (productoNuevo !== null) {
                dispatch(startAgregarDetalle({...productos.find(producto => producto.id === productoNuevo.id), cantidad:1}))
            }
        }
        nuevoProd();
    }, [productoNuevo, dispatch, productos])

    useEffect(() => {
        const limpiarAutocomplete = () => {
            if (cerrarModal)
                setProductoSeleccionado('');
                setSelectedOption('');
        }
        limpiarAutocomplete();
    }, [cerrarModal])

    useEffect(() => {
        const cerrarVentanaCliente = () => {
            if (cerrarModalCliente)
                setMostrarAgregar(false);
        }
        cerrarVentanaCliente();
    }, [cerrarModalCliente])

    const handleCheckChange = () => {
        setFormaPago('');
        setPlazoCredito('');
        setRemarcar(false);
        setCredito(!credito);
    }

    const handleEliminarDetalle = (index) => {
        dispatch(startActualizarDetallesFactura(detallesFactura.filter((detalle, i) => {
            return detalle.id !== index
        })));
    }

    const handleEliminarAdicional = (index) => {
        dispatch(startActualizarAdicionales(adicionalesFactura.filter((item, i) => {
            return index !== i
        })));
    }

    const handleEmitirFactura = () => {
        let dd = fechaEmision.getDate();
        let mm = fechaEmision.getMonth()+1; //January is 0!
        let yyyy = fechaEmision.getFullYear();
        if(dd<10){
                dd='0'+dd
            } 
            if(mm<10){
                mm='0'+mm
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
        detallesFactura.map(detalle => {
            return detalle.descripcion = detalle.descripcion.replace(/(\r\n|\n|\r)/gm, " ");
        });
        if ( !clienteSeleccionado ) {
            dispatch(startMostrarError('Debe seleccionar un cliente.'));
            return;
        } else if ( detallesFactura.length === 0 ) {
            dispatch(startMostrarError('No existen detalles a facturar.'));
            return;
        } else if ( formaPago === '' && !credito ) {
            dispatch(startMostrarError('Seleccione la forma de pago.'));
            setRemarcar(true);
            return;
        } else if ( plazoCredito === '' && credito ) {
            dispatch(startMostrarError('Seleccione el plazo del crédito.'));
            setRemarcar(true);
            return;
        }
        setRemarcar(false);
        let formasDePago = [{
            tipoFormaPago: formaPago,
            valorPago: valorTotal.toFixed(2),
            plazo: '0',
            tipoPlazo: 'DIAS',
        }]
        dispatch(startMostrarCargandoAlerta());
        dispatch(startEmitirFactura({
            cliente: clienteSeleccionado,
            fechaEmision: fechaEnvio,
            empresa,
            impuestosDetalle,
            detalles: detallesFactura,
            formasPago: formasDePago,
            datosAdicionales: adicionalesFactura,
            autorizar: true,
            detalleValores: {
                totalSinImpuestos: subtotalSinImpuestos.toFixed(2),
                totalDescuento: '0.00',
                totalIva,
                importeTotal: valorTotal.toFixed(2)
            }
        }));
    }

    useEffect(() => {
        setCredito(false);
        setRemarcar(false);
        setFormaPago('');
        setPlazoCredito('');
        dispatch(startObtenerDatosEmpresa(empresaId));
        dispatch(startLimpiarSeleccion());
        dispatch(startLimpiarDatosFactura());
    }, [dispatch, empresaId]);

    useEffect(() => {
        const evaluar = async () => {
            let arreglo = [];
            await formasPago.map((item) => {
                if (item.tipoPago) {
                    item.tipoPago.forEach((tipo, i) => {
                        arreglo.push({
                            codigo: `${item.codigo}-${i}`,
                            descripcion: tipo
                        });
                    });
                } else {
                    arreglo.push({
                        codigo: item.codigo,
                        descripcion: item.formaPago
                    });
                }
                return item;
            });
            setFormasPresentar(arreglo);
        }
        if (formasPago)
            evaluar();
    }, [formasPago]);

    useEffect(() => {
        const seleccionar = () => {
            if (productoSeleccionado !== '' && productoSeleccionado !== 'nuevo') {
                setSelectedOption('');
                const buscar = detallesFactura.find(det => det.id === productoSeleccionado);

                if (buscar !== undefined) {
                    dispatch(startMostrarError('Ya existe ese producto.'));
                    setProductoSeleccionado('');
                    return;
                }

                dispatch(startAgregarDetalle({...productos.find(producto => producto.id === productoSeleccionado), cantidad:1}))
                setProductoSeleccionado('');
            }
        }
        seleccionar();
    }, [productoSeleccionado, dispatch, productos, detallesFactura]);
    return (
        <div
            className="container mx-auto mb-6 mt-10 bg-white rounded-md shadow-lg px-4 pb-4"
        >
            <div className="flex justify-between py-2 px-3 rounded-md rounded-b-none ">
                <div className='flex flex-row'>
                    <i className="fas fa-dollar-sign bg-blue-500 ml-2 -mt-8 w-16 h-15 text-center pt-4 text-2xl rounded-md text-white"></i>
                    <h2 className="text-xl font-light tracking-wider text-gray-600 ml-8 mt-2">Nueva Factura</h2>
                </div>
                <div className="">
                    <div className="relative inline-block">
                        <NavLink
                            className="flex items-center p-2 mt-2 hover:bg-gray-100 focus:outline-none text-blue-400"
                            to="/emitidas"
                        >
                            <i className="fas fa-arrow-circle-left mr-2"></i>
                            <p className="hidden md:block">Regresar al listado</p>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className='bg-gray-200 pt-4 px-4 rounded-lg rounded-b-none mt-10 border border-gray-200 pb-1'>
                <p className='text-gray-700 text-xl font-light'>Datos Factura</p>
            </div>
            <div className='flex flex-col md:flex-row justify-evenly px-2 pt-8 border rounded-lg rounded-t-none border-gray-200 shadow-md'>
                <div className='mb-10 w-full md:w-1/3 flex flex-row ml-4 mt-2 px-2 cursor-pointer' onClick={ ()=> setMostrarClienteNuevo(true) }>
                    <button
                        className='bg-blue-500 text-white w-12 h-12 p-0 text-lg rounded-full focus:outline-none'
                    >
                        <i className='fas fa-user'></i>
                    </button>
                    <div className='flex flex-col'>
                        <p className="text-sm text-gray-700 ml-4">{!clienteSeleccionado ? 'Seleccione un cliente': clienteSeleccionado.razonSocial}</p>
                        {clienteSeleccionado && <p className='text-sm text-gray-500 ml-4'>{clienteSeleccionado.numeroIdentificacion}</p>}
                    </div>
                </div>
                <div className="mb-10 w-full md:w-1/3 px-6">
                    <label
                        className="text-sm text-gray-700"
                    >Número Factura</label>
                    <p
                        className="border-gray-200 focus:outline-none mt-2 text-sm text-gray-500"
                    >{empresa?
                                `${empresa.establecimiento}-${empresa.puntoEmision}-${pad.substring(0, pad.length - empresa.secuencialFactura.length) + empresa.secuencialFactura}`
                                : null}</p>
                </div>
                <div className="mb-10 flex flex-col w-full md:w-1/3 px-6">
                    <label
                        htmlFor="fechaEmision"
                        className="text-sm text-gray-700"
                    >Fecha Emisión</label>
                    <SeleccionFecha
                        startDate={fechaEmision}
                        setStartDate={setFechaEmision}
                    />
                </div>
                
            </div>

            <div className="border-gray-200 border-2 rounded-md mt-8 shadow-md">
                <TablaDetallesFactura data={detallesFactura} handleDelete={handleEliminarDetalle}/>
                <div className='flex items-center '>
                    <Autocomplete options={productos} 
                        value={selectedOption}
                        onChange={setSelectedOption}
                        productoSeleccionado={setProductoSeleccionado}
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row mb-8 justify-between text-left mt-4">
                <div className="w-full md:w-6/12 border-gray-200 border-2 rounded-md">
                    <Tabla
                        headers={headersAdicional}
                        data={adicionalesFactura}
                        handleEliminar={handleEliminarAdicional}
                        titulo="Datos Adicionales"
                    />
                    <button
                        className="flex items-center p-2 hover:bg-gray-100 focus:outline-none text-blue-400"
                        onClick={() => setMostrarNuevoAdicional(true)}
                    >
                        <i className="fas fa-plus-circle mr-2"></i>
                        <p className="">Agregar Valor Adicional</p>
                    </button>
                </div>
                <div className="w-full mt-4 md:mt-0 md:w-5/12 border-gray-200 border-2 rounded-md pt-2">
                    <ValoresFactura
                    />
                </div>
            </div>
            <div className='flex flex-col border-2 rounded-md shadow-md mb-4 pb-6'>
                <div className='mt-5 ml-5'>
                    <p className='text-gray-500 text-lg'>Pago</p>
                </div>
                <div className='flex flex-row ml-4 mt-6'>
                    <p className='text-gray-500 text-xl'>Factura a crédito</p>
                    <button className='has-tooltip focus:outline-none ml-2'>
                        <span className='tooltip text-xs rounded shadow-lg p-2 bg-black text-white -mt-14 -ml-32 w-64'>Seleccione esta opción si la factura no es pagada al momento de su emisión.</span>
                        <i className="fas fa-question-circle"></i>
                    </button>
                    <div className="relative inline-block w-10 ml-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            value={credito} 
                            disabled={valorTotal === 0} 
                            onChange={handleCheckChange} 
                            name="toggle" 
                            id="toggle" 
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer disabled:cursor-not-allowed"
                        />
                        <label 
                            htmlFor="toggle" 
                            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-200 cursor-pointer"
                        ></label>
                    </div>
                </div>
                {
                    credito ?
                    <div className='ml-4 mt-8'>
                        <div className='mb-2'>
                            <p className='text-lg text-gray-500'>Plazo</p>
                            <select
                                className={"pb-1 text-sm capitalize border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg disabled:opacity-30" + 
                                    ((remarcar && plazoCredito === '' && credito) ? ' border-2 border-red-400' : '')
                                }
                                name="plazoCredito"
                                value={plazoCredito}
                                disabled={valorTotal === 0}
                                onChange={(e) => setPlazoCredito(e.target.value)}
                            >
                                <option value=''>--SELECCIONE--</option>
                                <option value='7'>7 días</option>
                                <option value='15'>15 días</option>
                                <option value='30'>30 días</option>
                                <option value='60'>60 días</option>
                                <option value='90'>90 días</option>
                                
                            </select>
                        </div>
                        
                    </div> :
                    <div className='ml-4 mt-8'>
                        <div className='mb-2'>
                            <p className='text-lg text-gray-500'>Forma de pago</p>
                            <select
                                className={"pb-1 text-sm capitalize border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg disabled:opacity-30" + 
                                    ((remarcar && formaPago === '' && !credito) ? ' border-2 border-red-400' : '')
                                }
                                name="formaPago"
                                value={formaPago}
                                disabled={valorTotal === 0}
                                onChange={(e) => setFormaPago(e.target.value)}
                            >
                                <option value=''>--SELECCIONE--</option>
                                { formasPresentar && formasPresentar.map(item => (
                                    <option key={item.codigo} value={item.codigo}>{item.descripcion.toLowerCase()}</option>
                                )) }
                            </select>
                        </div>
                    
                </div>
                }
                
            </div>
            <div className="flex justify-center">
                <button 
                    className="bg-blue-500 uppercase rounded-3xl py-3 px-8 text-white mr-4 focus:outline-none"
                    onClick={handleEmitirFactura} 
                >Enviar</button>
                <NavLink 
                    className="bg-red-500 uppercase rounded-3xl py-3 px-8 text-white focus:outline-none"
                    to="/emitidas"
                >Cancelar</NavLink>
            </div>
            {
                mostrarNuevoAdicional && 
                <>
                    <NuevoAdicional
                        setShowModal={setMostrarNuevoAdicional}
                    />
                </>
            }
            {
                (productoSeleccionado === 'nuevo' && !cerrarModal) &&
                <NuevoProducto setShowModal={() => setProductoSeleccionado('')} descripcionInicial={selectedOption}/>
            }
            {
                mostrarCargando && <Cargando />
            }
            {
                claveAcceso && <ImprimirComprobante claveAcceso={claveAcceso} history={history} tipoComprobante='factura'/>
            }
            {
                mostrarClienteNuevo && <TablaClientes presentarTabla={setMostrarClienteNuevo} setIdentificacionBusqueda={setIdentificacionBusqueda} setMostrarAgregar={setMostrarAgregar}/>
            }
            {
                mostrarAgregar && <EditarCliente setShowModal={setMostrarAgregar} identificacionIngresada={identificacionBusqueda} />
            }
        </div>
    )
}
