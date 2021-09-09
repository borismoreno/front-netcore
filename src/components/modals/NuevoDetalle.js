import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { startObtenerTarifasIva, startObtenerTiposProducto } from '../../actions/configuracion';
import { startAgregarDetalle } from '../../actions/factura';

export const NuevoDetalle = ({setShowModal}) => {
    const dispatch = useDispatch();
    const { tiposProducto, tarifasIva } = useSelector(state => state.configuracion);
    const formik = useFormik({
        initialValues: {
            descripcion: '',
            cantidad: 0,
            valorUnitario: 0,
            tipoProducto: '',
            tarifaIva: '',
            descuento: 0,
        },
        validationSchema: Yup.object({
            descripcion: Yup.string()
                            .min(5, 'La descripción debe tener al menos 5 caracteres.')
                            .required('La descripción del producto es obligatoria.'),
            cantidad: Yup.number()
                        .required('La cantidad es obligatoria.')
                        .min(1, 'La cantidad es obligatoria'),
            valorUnitario: Yup.number()
                                .required('El precio es obligatorio.')
                                .min(1, 'El precio es obligatorio'),
            tipoProducto: Yup.string()
                            .required('El tipo de producto es obligatorio.'),
            tarifaIva: Yup.string()
                            .required('La tarifa IVA es obligatoria.'),
            descuento: Yup.number()
                            .min(0, 'El descuento debe ser mayor a 0'),
        }),
        onSubmit: datos => {
            // dispatch(startGuardarCliente(datos));
            let valorDescuento = 0;
            setShowModal(false);
            datos.valorUnitario = Number(datos.valorUnitario.toFixed(2));
            if ( datos.descuento ) {
                valorDescuento = calcularDescuento(datos.valorUnitario, datos.descuento);
            }
            const subtotal = calcularSubtotal(datos.cantidad, datos.valorUnitario - valorDescuento);
            const tarifaImp = tarifasIva.find(tarifa => tarifa.codigo === datos.tarifaIva).porcentaje.split('%');
            let tarifaIvaCalculo = '0';
            let valorImpuesto = 0.00;
            if ( tarifaImp.length > 1 ) {
              tarifaIvaCalculo = tarifaImp[0];
            }
            if ( Number(tarifaIvaCalculo) > 0 ) {
              valorImpuesto = Number(((subtotal * Number(tarifaIvaCalculo)) / 100).toFixed(2));
            }
            dispatch(startAgregarDetalle({
                ...datos,
                valorDescuento,
                subtotal,
                valorImpuesto
            }));
        }
    })
    useEffect(() => {
        dispatch(startObtenerTiposProducto());
        dispatch(startObtenerTarifasIva());
    }, [dispatch]);

    const calcularDescuento = (precioUnitario, descuento) => {
        return (precioUnitario * descuento) / 100;
    }

    const calcularSubtotal = (cantidad, precioUnitario) => {
        return Number((cantidad * precioUnitario).toFixed(2));
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
                    Agregar Detalle
                  </h3>
                  <button
                    className="p-1 ml-auto border-0 text-black float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-lg block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div
                    className="md:px-6 mb-6"
                  >
                    <label
                    htmlFor="descripcion"
                    className="text-xs font-bold"
                    >Descripción</label>
                      <input
                        id="descripcion"
                        className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                        placeholder="Descripción Producto"
                        name="descripcion"
                        autoComplete="off"
                        autoFocus
                        value={formik.values.descripcion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      { 
                        formik.touched.descripcion && formik.errors.descripcion ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.descripcion }
                            </span>
                        ) : null
                      }
                  </div>
                  <div className="flex justify-between">
                    <div
                        className="md:pl-6 mb-6"
                    >
                        <label
                        htmlFor="valorUnitario"
                        className="text-xs font-bold"
                        >Valor Unitario</label>
                        <input
                            id="valorUnitario"
                            className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                            placeholder="$20"
                            name="valorUnitario"
                            type="number"
                            min="0"
                            value={formik.values.valorUnitario}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        { 
                            formik.touched.valorUnitario && formik.errors.valorUnitario ?
                            (
                                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                    { formik.errors.valorUnitario }
                                </span>
                            ) : null
                        }
                    </div>
                    <div
                        className="md:pr-6 mb-6"
                    >
                        <label
                        htmlFor="cantidad"
                        className="text-xs font-bold"
                        >Cantidad</label>
                        <input
                            id="cantidad"
                            className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                            placeholder="1"
                            name="cantidad"
                            type="number"
                            min="0"
                            value={formik.values.cantidad}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        { 
                            formik.touched.cantidad && formik.errors.cantidad ?
                            (
                                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                    { formik.errors.cantidad }
                                </span>
                            ) : null
                        }
                    </div>
                  </div>
                  <div
                    className="md:px-6 mb-6"
                  >
                    <label
                        htmlFor="tipoProducto"
                        className="text-xs font-bold"
                    >Tipo Producto</label>
                      <select
                        className="w-full pb-1 mt-2 text-sm border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg"
                        name="tipoProducto"
                        value={formik.values.tipoProducto}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                          <option value=''>--SELECCIONE--</option>
                          { tiposProducto && tiposProducto.map(item => (
                              <option key={item._id} value={item.codigo}>{item.descripcion}</option>
                          )) }
                      </select>
                      { 
                        formik.touched.tipoProducto && formik.errors.tipoProducto ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.tipoProducto }
                            </span>
                        ) : null
                      }
                  </div>
                  <div
                    className="md:px-6 mb-6"
                  >
                    <label
                        htmlFor="tipoProducto"
                        className="text-xs font-bold"
                    >Tarifa IVA</label>
                      <select
                        className="w-full pb-1 mt-2 text-sm border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg"
                        name="tarifaIva"
                        value={formik.values.tarifaIva}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                          <option value=''>--SELECCIONE--</option>
                          { tarifasIva && tarifasIva.map(item => (
                              <option key={item._id} value={item.codigo}>{item.porcentaje}</option>
                          )) }
                      </select>
                      { 
                        formik.touched.tarifaIva && formik.errors.tarifaIva ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.tarifaIva }
                            </span>
                        ) : null
                      }
                  </div>
                  <div
                        className="md:px-6 mb-6"
                    >
                        <label
                        htmlFor="descuento"
                        className="text-xs font-bold"
                        >Descuento</label>
                        <input
                            id="descuento"
                            className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                            placeholder="10 %"
                            name="descuento"
                            type="number"
                            min="0"
                            value={formik.values.descuento}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        { 
                            formik.touched.descuento && formik.errors.descuento ?
                            (
                                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                    { formik.errors.descuento }
                                </span>
                            ) : null
                        }
                    </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={formik.handleSubmit}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}
