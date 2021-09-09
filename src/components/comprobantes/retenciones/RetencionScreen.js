import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { startBuscarCliente, startLimpiarSeleccion, startObtenerClientes } from '../../../actions/clientes';
import { startObtenerDatosEmpresa, startObtenerImpuestosRetencion, startObtenerTiposDocumento } from '../../../actions/configuracion';
import { startEliminarDetalleRetencion, startEmitirRetencion, startLimpiarDatosRetencion } from '../../../actions/retencion';
import { obtenerMesNumero } from '../../../helpers/meses';
import { useForm } from '../../../hooks/useForm';
import { BuscarCliente } from '../../clientes/BuscarCliente';
import { SeleccionFecha } from '../../ui/SeleccionFecha';
import TablaImpuestos from './TablaImpuestos';
import { Tabla } from '../../ui/Tabla';
import { startActualizarAdicionales, startLimpiarDatosFactura } from '../../../actions/factura';
import { NuevoAdicional } from '../../modals/NuevoAdicional';
import { startMostrarCargandoAlerta, startMostrarError } from '../../../actions/alerta';
import { Cargando } from '../../ui/Cargando';
import { ImprimirComprobante } from '../../modals/ImprimirComprobante';
import { validarNumeroDocumento } from '../../../helpers/validaciones';

const clienteInicial = {
    razonSocial: '',
    direccion: '',
    mail: ''
}

const headersAdicional = [
    'Nombre',
    'Valor',
    ''
]

const RetencionScreen = ({history}) => {
    const fechaFiscal = new Date();
    const mesNumero = obtenerMesNumero(fechaFiscal.getMonth());
    const [ formValores, handleInputChangeSelect ] = useForm({
        documento: '',
        numeroDocumento: '',
        periodoFiscal: mesNumero,
        anioFiscal: fechaFiscal.getFullYear().toString(),
    });
    const { documento, numeroDocumento, periodoFiscal, anioFiscal } = formValores;
    const wrapperRef = useRef(null);
    const dispatch = useDispatch();
    const { empresa, tiposDocumento, impuestosRetencion } = useSelector(state => state.configuracion);
    const { mostrarCargando } = useSelector(state => state.alerta);
    const { empresaId } = useSelector(state => state.auth);
    const { clienteSeleccionado } = useSelector(state => state.clientes);
    const { detallesRetencion, claveAcceso } = useSelector(state => state.retencion);
    const [ formValues, setFormValues ] = useState(clienteInicial);
    const { adicionalesFactura } = useSelector(state => state.factura);
    const [ documentos, setDocumentos ] = useState([]);
    const [ mostrarNueva, setMostrarNueva ] = useState(false);
    const [ mostrarNuevoAdicional, setMostrarNuevoAdicional ] = useState(false);
    const [ numeroIdentificacion, setNumeroIdentificacion ] = useState('');
    const [ fechaEmision, setFechaEmision ] = useState(new Date());
    const [ fechaEmisionDocumento, setFechaEmisionDocumento ] = useState(new Date());
    const [ display, setDisplay ] = useState(false);
    const { razonSocial, direccion, mail } = formValues;
    const pad = '000000000';    

    const handleChange = (e) => {
        setNumeroIdentificacion(e.target.value);
        dispatch(startLimpiarSeleccion());
    }

    const handleInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const handleEliminarAdicional = (index) => {
        dispatch(startActualizarAdicionales(adicionalesFactura.filter((item, i) => {
            return index !== i
        })));
    }

    const handleDelete = (id) => {
        dispatch(startEliminarDetalleRetencion(id));
    }

    const handleClickOutside = event => {
        const {current: wrap} = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
            setDisplay(false);
        }
    }

    const handleEmitirRetencion = () => {
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
        dd = fechaEmisionDocumento.getDate();
        mm = fechaEmisionDocumento.getMonth()+1; //January is 0!
        yyyy = fechaEmisionDocumento.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        }
        if ( !clienteSeleccionado ) {
            dispatch(startMostrarError('Debe seleccionar un cliente.'));
            return;
        } else if ( !documento ) {
            dispatch(startMostrarError('Debe seleccionar el tipo de documento sustento.'));
            return;
        } else if ( !validarNumeroDocumento(numeroDocumento) ) {
            dispatch(startMostrarError('Debe ingresar un número de documento sustento válido.'));
            return;
        } else if ( detallesRetencion.length === 0 ) {
            dispatch(startMostrarError('No existen detalles en la retención.'));
            return;
        }
        const fechaEmisionSustEnvio = `${dd}/${mm}/${yyyy}`;
        let clienteEnviar = clienteSeleccionado;
        clienteEnviar.direccion = direccion;
        clienteEnviar.razonSocial = razonSocial;
        clienteEnviar.mail = mail;
        const docEnviar = numeroDocumento.replaceAll('-','');
        const periodoFiscalEnviar = periodoFiscal + '/' + anioFiscal;
        dispatch(startMostrarCargandoAlerta());
        dispatch(startEmitirRetencion({
            empresa,
            fechaEmision: fechaEnvio,
            detallesRetencion,
            cliente: clienteEnviar,
            datosAdicionales: adicionalesFactura,
            periodoFiscal: periodoFiscalEnviar,
            codDocSustento: documento,
            numDocSustento: docEnviar,
            fechaEmisionDocSustento: fechaEmisionSustEnvio,
        }));
    }

    useEffect(() => {
        dispatch(startBuscarCliente(numeroIdentificacion));
    }, [numeroIdentificacion, dispatch])

    useEffect(() => {
        dispatch(startLimpiarDatosRetencion());
        dispatch(startLimpiarDatosFactura());
        dispatch(startObtenerTiposDocumento());
        dispatch(startObtenerImpuestosRetencion());
        dispatch(startObtenerClientes());
        setNumeroIdentificacion('');
        dispatch(startLimpiarSeleccion());
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [dispatch])

    useEffect(() => {
        setNumeroIdentificacion('');
        dispatch(startObtenerDatosEmpresa(empresaId));
        dispatch(startLimpiarSeleccion());
    }, [dispatch, empresaId]);

    useEffect(() => {
        if (tiposDocumento) {
            setDocumentos(tiposDocumento.filter(tipo => {
                return tipo.presentaRetencion
            }))
        }
    }, [tiposDocumento]);

    useEffect(() => {
        if ( clienteSeleccionado ) {
            setFormValues({
                razonSocial: clienteSeleccionado.razonSocial,
                direccion: clienteSeleccionado.direccion,
                mail: clienteSeleccionado.mail
            })
            setNumeroIdentificacion(clienteSeleccionado.numeroIdentificacion);
            setDisplay(false);
        } else {
            setFormValues(clienteInicial);
            setNumeroIdentificacion('');
        }
    }, [clienteSeleccionado, setFormValues])
    return (
        <div className='container mx-auto mb-6'>
            <div className="flex justify-between py-2 px-3 bg-gray-200 rounded-md rounded-b-none">
                <h2 className="text-2xl font-bold mt-1 tracking-wider uppercase">Retención</h2>
                <div className="">
                    <div className="relative inline-block">
                        <NavLink
                            className="flex items-center p-2 hover:bg-gray-100 focus:outline-none text-blue-400"
                            to="/retenciones"
                        >
                            <i className="fas fa-arrow-circle-left mr-2"></i>
                            <p className="hidden md:block">Regresar al listado</p>
                        </NavLink>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-wrap md:flex-row mb-8 justify-between px-4 py-2 border-gray-200 border-l-2 border-b-2 border-r-2 rounded-md rounded-t-none text-left">
                <div 
                    className="w-full md:w-5/12" 
                >
                    <div 
                        className="mb-10"
                        ref={wrapperRef}
                    >
                        <label
                            htmlFor="numeroIdentificacion"
                            className="text-xs font-bold"
                        >Identificación</label>
                        <input
                            id="numeroIdentificacion"
                            className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 mt-2 text-sm"
                            placeholder="Ingrese la identificación"
                            name="numeroIdentificacion"
                            value={numeroIdentificacion}
                            onChange={handleChange}
                            onFocus={() => setDisplay(true)}
                            autoComplete="off"
                        />
                        {display &&
                            <BuscarCliente
                            />
                        }
                    </div>
                    <div className="mb-10">
                        <label
                            htmlFor="razonSocial"
                            className="text-xs font-bold"
                        >Nombre</label>
                        <input
                            id="razonSocial"
                            className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 mt-2 text-sm"
                            autoComplete="off"
                            name="razonSocial"
                            value={razonSocial}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-10">
                        <label
                            htmlFor="direccion"
                            className="text-xs font-bold"
                        >Dirección</label>
                        <input
                            id="direccion"
                            className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 mt-2 text-sm"
                            autoComplete="off"
                            name="direccion"
                            value={direccion}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-10">
                        <label
                            htmlFor="mail"
                            className="text-xs font-bold"
                        >Email</label>
                        <input
                            id="mail"
                            className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 mt-2 text-sm"
                            autoComplete="off"
                            name="mail"
                            value={mail}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="w-full md:w-5/12 mb-5 ">
                    <div className="mb-10">
                        <label
                            className="text-xs font-bold"
                        >Número Retención</label>
                        <p
                            className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 mt-2 text-sm"
                        >{empresa?
                                    `${empresa.establecimiento}-${empresa.puntoEmision}-${pad.substring(0, pad.length - empresa.secuencialRetencion.length) + empresa.secuencialRetencion}`
                                    : null}</p>
                    </div>
                    <div className="mb-10 flex justify-between flex-col">
                        <label
                            htmlFor="fechaEmision"
                            className="text-xs font-bold"
                        >Fecha Emisión</label>
                        <SeleccionFecha
                            startDate={fechaEmision}
                            setStartDate={setFechaEmision}
                        />
                    </div>
                    <div className="mb-10 flex flex-col">
                        <label
                            htmlFor="periodoFiscal"
                            className="text-xs font-bold"
                        >Periodo Fiscal</label>
                        <div className='flex'>
                            <select
                                className="pb-1 mt-2 text-sm border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mr-2"
                                name="periodoFiscal"
                                value={periodoFiscal}
                                onChange={handleInputChangeSelect}
                            >
                                <option value='01'>Enero</option>
                                <option value='02'>Febrero</option>
                                <option value='03'>Marzo</option>
                                <option value='04'>Abril</option>
                                <option value='05'>Mayo</option>
                                <option value='06'>Junio</option>
                                <option value='07'>Julio</option>
                                <option value='08'>Agosto</option>
                                <option value='09'>Septiembre</option>
                                <option value='10'>Octubre</option>
                                <option value='11'>Noviembre</option>
                                <option value='12'>Diciembre</option>
                                {/* { formasPago && formasPago.map(item => (
                                <option key={item._id} value={item.codigo}>{item.formaPago}</option>
                            )) } */}
                            </select>
                            <p className='mt-2 mr-2'>/</p>
                            <input
                                id="anioFiscal"
                                className="border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 mt-2 text-sm"
                                autoComplete="off"
                                name="anioFiscal"
                                value={anioFiscal}
                                onChange={handleInputChangeSelect}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-200 px-2 pt-4 mt-4">
                <p>Documento Sustento</p>
            </div>
            <div className="flex flex-col flex-wrap md:flex-row mb-8 md:justify-between px-4 py-2 border-gray-200 border-l-2 border-b-2 border-r-2 rounded-md rounded-t-none text-left">
                <div 
                    className="w-full md:w-2/6" 
                >
                    <div className="mb-10 flex flex-col">
                        <label
                            htmlFor="documento"
                            className="text-xs font-bold my-2"
                        >Documento</label>
                        <select
                            className="w-full md:w-2/3 pb-1 mt-2 text-sm border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg"
                            name="documento"
                            value={documento}
                            onChange={handleInputChangeSelect}
                        >
                            <option value=''>--SELECCIONE--</option>
                            { documentos && documentos.map(item => (
                              <option key={item._id} value={item.codigo}>{item.tipoDocumento}</option>
                          )) }
                        </select>
                    </div>
                </div>
                <div 
                    className='w-full md:w-2/6'
                >
                    <div className="mb-10 flex flex-col">
                        <div className="my-1">
                            <label
                                htmlFor="numeroDocumento"
                                className="text-xs font-bold"
                            >Número</label>
                            <span className="text-xs font-thin ml-2">(Ejm: 001-001-000000123)</span>
                        </div>
                        <input
                            id="numeroDocumento"
                            className="w-full md:w-2/3 border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 mt-2 text-sm"
                            autoComplete="off"
                            name="numeroDocumento"
                            value={numeroDocumento}
                            onChange={handleInputChangeSelect}
                        />
                    </div>
                </div>
                <div 
                    className='w-full md:w-2/6 mt-2'
                >
                    <div className="mb-10 flex justify-between flex-col">
                        <label
                            htmlFor="fechaEmisionDocumento"
                            className="text-xs font-bold"
                        >Fecha Emisión</label>
                        <SeleccionFecha
                            startDate={fechaEmisionDocumento}
                            setStartDate={setFechaEmisionDocumento}
                            minimoUnMes={false}
                        />
                    </div>
                </div>
                
            </div>
            <div className='bg-gray-200 px-2 pt-4 mt-8 flex flex-col'>
                <p className=''>Detalles Retención</p>
                {/* <p className='mt-2 text-gray-400 font-light'>Seleccione los items que desea añadir</p> */}
                <div className='mt-4 p-6 w-full overflow-x-auto'>
                    <table className='items-center w-full'>
                        <thead>
                            <tr className='border-b-2 border-gray-400'>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Tipo</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Código</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Porcentaje</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Base Imponible</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'>Valor Retenido</th>
                                <th className='px-6 text-gray-600 align-middle border py-3 text-xs uppercase font-semibold text-center'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                detallesRetencion.map(detalle => {
                                    return <tr
                                        key={detalle._id}
                                    >
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{detalle.impuesto}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{detalle.codigoAnexo}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{`${detalle.porcentaje} %`}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{`$ ${detalle.baseImponible.toFixed(2)}`}</td>
                                        <td className='border-t-0 px-6 max-w-sm text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500'>{`$ ${detalle.valorRetenido.toFixed(2)}`}</td>
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
                    <button
                        className="flex items-center p-2 hover:bg-gray-100 focus:outline-none text-blue-400"
                        onClick={() => setMostrarNueva(true)}
                    >
                        <i className="fas fa-plus-circle mr-2"></i>
                        <p className="">Agregar Detalle</p>
                    </button>
                </div>
            </div>
            <div className="flex flex-col flex-wrap md:flex-row mb-8 justify-between text-left mt-8">
                <div className="w-full md:w-6/12 border-gray-200 border-2 rounded-md">
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
                <div className="w-full mt-8 md:mt-0 md:w-5/12 border-gray-200 border-2 rounded-md pt-2">
                    <div className="flex justify-around py-5">
                        <label className="px-2 font-light text-2xl">Total Retenido</label>
                        <label className="px-4 font-normal text-2xl text-green-500">{ `$ ${
                            (detallesRetencion.length > 0) ? 
                            (detallesRetencion.reduce((accumulator, current) => accumulator + current.valorRetenido, 0)).toFixed(2)
                            : '0.00'
                        }` }</label>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <button 
                    className="bg-blue-500 uppercase rounded-3xl py-3 px-8 text-white mr-4 focus:outline-none"
                    onClick={handleEmitirRetencion} 
                >Enviar</button>
                <NavLink
                    className="bg-red-500 uppercase rounded-3xl py-3 px-8 text-white focus:outline-none"
                    to="/retenciones"
                >Cancelar</NavLink>
            </div>
            {
                mostrarNueva && <TablaImpuestos setMostrarNueva={setMostrarNueva} impuestosRetencion={impuestosRetencion} />
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
                claveAcceso && <ImprimirComprobante claveAcceso={claveAcceso} history={history} tipoComprobante='retencion'/>
            }
        </div>
    )
}

export default RetencionScreen;
