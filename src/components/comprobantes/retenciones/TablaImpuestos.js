import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { startAgregarDetalleRetencion } from '../../../actions/retencion';
import { startMostrarError } from '../../../actions/alerta';

const TablaImpuestos = ({setMostrarNueva, impuestosRetencion = []}) => {
    const { mostrarError } = useSelector(state => state.alerta);
    const [ nombreImpuesto, setNombreImpuesto ] = useState('');
    const dispatch = useDispatch();
    const [ deshabilitar, setDeshabilitar ] = useState(false);
    const [ impuestoSeleccionado, setImpuestoSeleccionado ] = useState({});
    const { detallesRetencion } = useSelector(state => state.retencion);
    const handleInputChange = (e) => {
        setNombreImpuesto(e.target.value);
    }
    const formik = useFormik({
        initialValues: {
            baseImponible: 0,
            porcentaje: 0,
            valorRetenido: 0,
        },
        validationSchema: Yup.object({
            baseImponible: Yup.number()
                                .required('La base imponible es obligatoria.')
                                .min(1, 'La base imponible es obligatoria'),
            porcentaje: Yup.number()
                                .required('El porcentaje es obligatorio.')
                                .min(0, 'El porcentaje es obligatorio.'),
            valorRetenido: Yup.number()
                                .required('El valor retenido es obligatorio.')
                                .min(0, 'El valor retenido es obligatorio.'),
        }),
        onSubmit: datos => {
            const { baseImponible, porcentaje, valorRetenido } = datos;
            const detalle = detallesRetencion.find(det => det.codigoAnexo === impuestoSeleccionado.codigoAnexo);
            if (detalle) {
                dispatch(startMostrarError('Ya existe un detalle con ese código.', 'error'));
                return;
            }
            dispatch(startAgregarDetalleRetencion({
                ...impuestoSeleccionado,
                baseImponible,
                porcentaje,
                valorRetenido
            }));

            setMostrarNueva(false);
            // // dispatch(startGuardarCliente(datos));
            // let valorDescuento = 0;
            // setShowModal(false);
            // datos.valorUnitario = Number(datos.valorUnitario.toFixed(2));
            // if ( datos.descuento ) {
            //     valorDescuento = calcularDescuento(datos.valorUnitario, datos.descuento);
            // }
            // const subtotal = calcularSubtotal(datos.cantidad, datos.valorUnitario - valorDescuento);
            // const tarifaImp = tarifasIva.find(tarifa => tarifa.codigo === datos.tarifaIva).porcentaje.split('%');
            // let tarifaIvaCalculo = '0';
            // let valorImpuesto = 0.00;
            // if ( tarifaImp.length > 1 ) {
            //   tarifaIvaCalculo = tarifaImp[0];
            // }
            // if ( Number(tarifaIvaCalculo) > 0 ) {
            //   valorImpuesto = Number(((subtotal * Number(tarifaIvaCalculo)) / 100).toFixed(2));
            // }
            // dispatch(startAgregarDetalle({
            //     ...datos,
            //     valorDescuento,
            //     subtotal,
            //     valorImpuesto
            // }));
        }
    })

    const handleChangeCantidad = (e) => {
        formik.setFieldValue(e.target.name, Number(e.target.value));
    }

    const handleSelectChange = (e) => {
        setImpuestoSeleccionado(impuestosRetencion.find(item => item._id === e.target.value));
    }
    useEffect(() => {
        setNombreImpuesto('');
    }, []);

    useEffect(() => {
        formik.setFieldValue('porcentaje', (impuestoSeleccionado.porcentaje) ? Number(impuestoSeleccionado.porcentaje): 0);
        setDeshabilitar((impuestoSeleccionado.porcentaje) ? true: false);
        // eslint-disable-next-line
    }, [impuestoSeleccionado])
    useEffect(() => {
        const valorCalculado = (formik.values.baseImponible * formik.values.porcentaje) / 100;
        formik.setFieldValue('valorRetenido', Number(valorCalculado.toFixed(2)));
        // eslint-disable-next-line
    }, [formik.values.baseImponible, formik.values.porcentaje]);
    return ( 
        <>
            <div
                className={`justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 ${mostrarError ? 'z-40' : 'z-50'} outline-none focus:outline-none`}
            >
                <div className="relative w-11/12 md:w-9/12 my-6 pb-2">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-2">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                            <h3 className="text-2xl font-semibold">
                                Seleccionar
                            </h3>
                            {/* <button
                                className="p-1 ml-auto border-0 text-black float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setMostrarNueva(false)}
                            >
                                <span className="bg-transparent text-black h-6 w-6 text-lg block outline-none focus:outline-none">
                                x
                                </span>
                            </button> */}
                            {/* <Pagination
                                rowsPerPage={rowsPerPage}
                                totalRows={facturasProcesadas.length}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                setRowsPerPage={setRowsPerPage}
                                mostrarCombo={false}
                            /> */}
                            <div className='flex w-1/2'>
                                <i
                                    className="fas text-blue-400 fa-search mr-2 mt-2"
                                ></i>
                                <input
                                    id="nombreImpuesto"
                                    className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 mt-2 text-sm"
                                    autoComplete="off"
                                    name="nombreImpuesto"
                                    value={nombreImpuesto}
                                    onChange={handleInputChange}
                                />

                            </div>
                        </div>
                        <div className="relative flex-auto h-96 overflow-x-auto">
                            <table className="items-center w-full bg-transparent border-collapse">
                                <thead>
                                    <tr>
                                        <th
                                            className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                        ></th>
                                        <th
                                            className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                        >Código Anexo</th>
                                        <th
                                            className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                        >Descripción</th>
                                        <th
                                            className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                        >Porcentaje</th>
                                        <th
                                            className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                        >Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        impuestosRetencion
                                        .filter(({impuestoRetencion}) => impuestoRetencion.toLowerCase().indexOf(nombreImpuesto.toLowerCase()) > -1)
                                        .map(impuesto => {
                                            return <tr
                                                key={impuesto._id}
                                                className="border-b-2 hover:bg-blue-50"
                                                onChange={handleSelectChange}
                                            >
                                                <td
                                                    className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500"
                                                >
                                                    <input type="radio" className="form-radio" name="idSeleccionado" value={impuesto._id} />
                                                </td>
                                                <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{ impuesto.codigoAnexo }</td>
                                                {/* <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{ impuesto.impuestoRetencion }</td> */}
                                                <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs p-4 text-gray-500"><p className="text-justify">{ impuesto.impuestoRetencion }</p></td>
                                                <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{ `${(impuesto.porcentaje) ? impuesto.porcentaje: '' } %` }</td>
                                                <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{ impuesto.impuesto }</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className='flex flex-col md:flex-row md:justify-evenly my-4'>
                            <div className=''>
                                <label
                                    htmlFor="baseImponible"
                                    className="text-xs font-bold"
                                >Base Imponible</label>
                                <input
                                    id="baseImponible"
                                    className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                                    placeholder="$20"
                                    name="baseImponible"
                                    type="number"
                                    min="0"
                                    value={formik.values.baseImponible}
                                    onChange={handleChangeCantidad}
                                    onBlur={formik.handleBlur}
                                />
                                { 
                                    formik.touched.baseImponible && formik.errors.baseImponible ?
                                    (
                                        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                            { formik.errors.baseImponible }
                                        </span>
                                    ) : null
                                }
                            </div>
                            <div className=''>
                                <label
                                    htmlFor="porcentaje"
                                    className="text-xs font-bold"
                                >Porcentaje</label>
                                <input
                                    id="porcentaje"
                                    className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                                    placeholder="$20"
                                    name="porcentaje"
                                    type="number"
                                    min="0"
                                    value={formik.values.porcentaje}
                                    onChange={handleChangeCantidad}
                                    onBlur={formik.handleBlur}
                                    disabled={deshabilitar}
                                />
                                { 
                                    formik.touched.porcentaje && formik.errors.porcentaje ?
                                    (
                                        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                            { formik.errors.porcentaje }
                                        </span>
                                    ) : null
                                }
                            </div>
                            <div className=''>
                                <label
                                    htmlFor="valorRetenido"
                                    className="text-xs font-bold"
                                >Valor Retenido</label>
                                <input
                                    id="valorRetenido"
                                    className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                                    placeholder="$20"
                                    name="valorRetenido"
                                    type="number"
                                    min="0"
                                    disabled={true}
                                    value={formik.values.valorRetenido}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                { 
                                    formik.touched.valorRetenido && formik.errors.valorRetenido ?
                                    (
                                        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                            { formik.errors.valorRetenido }
                                        </span>
                                    ) : null
                                }
                            </div>
                        </div>
                        <div className="flex items-center justify-center p-6 border-t border-solid border-gray-300 rounded-b">
                  
                            <button
                                className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded-3xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                type="button"
                                style={{ transition: "all .15s ease" }}
                                onClick={formik.handleSubmit}
                            >
                                Agregar
                            </button>
                            <button
                                className="bg-red-500 text-white hover:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded-3xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                type="button"
                                style={{ transition: "all .15s ease" }}
                                onClick={() => setMostrarNueva(false)}
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
 
export default TablaImpuestos;