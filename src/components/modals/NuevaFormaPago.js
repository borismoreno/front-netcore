import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { startObtenerFormasPago } from '../../actions/configuracion';
import { startAgregarFormaPago } from '../../actions/factura';

export const NuevaFormaPago = ({setShowModal, valorInicial = 0.00}) => {
    const dispatch = useDispatch();
    const { formasPago } = useSelector(state => state.configuracion);
    const formik = useFormik({
        initialValues: {
            tipoFormaPago: '01',
            valorPago: valorInicial.toFixed(2),
            plazo: '0',
            tipoPlazo: 'DIAS',
        },
        validationSchema: Yup.object({
            tipoFormaPago: Yup.string()
                            .required('El nombre es obligatorio.'),
            valorPago: Yup.number()
                                .min(1, 'Debe ingresar un valor.')
                                .max(valorInicial, `Valor maximo $${ valorInicial }.`)
                                .required('El valor es obligatorio.'),
            plazo: Yup.number()
                        .min(0, 'Debe ingresar un valor.')
                        .required('Debe ingresar un valor.')
        }),
        onSubmit: datos => {
            setShowModal(false);
            const descripcion = obtenerDescripcionFormaPago(datos.tipoFormaPago);
            dispatch(startAgregarFormaPago({
              descripcion,
              ...datos
            }));
        }
    })

    const obtenerDescripcionFormaPago = (codigoFormaPago) => {
      let descripcion = '';
      formasPago.map(forma => {
        if ( forma.codigo === codigoFormaPago ) descripcion = forma.formaPago;
        return forma;
      });
      return descripcion;
    }
    useEffect(() => {
        dispatch(startObtenerFormasPago());
    }, [dispatch])
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
                    Agregar Forma Pago
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
                        htmlFor="tipoFormaPago"
                        className="text-xs font-bold"
                    >Forma Pago</label>
                      <select
                        className="w-full pb-1 mt-2 text-sm border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg"
                        name="tipoFormaPago"
                        value={formik.values.tipoFormaPago}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                          { formasPago && formasPago.map(item => (
                              <option key={item._id} value={item.codigo}>{item.formaPago}</option>
                          )) }
                      </select>
                      { 
                        formik.touched.tipoFormaPago && formik.errors.tipoFormaPago ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.tipoFormaPago }
                            </span>
                        ) : null
                      }
                  </div>
                  <div
                        className="md:pl-6 mb-6"
                    >
                        <label
                        htmlFor="valorPago"
                        className="text-xs font-bold"
                        >Valor Forma Pago</label>
                        <input
                            id="valorPago"
                            className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                            placeholder="$20"
                            name="valorPago"
                            autoFocus
                            type="currency"
                            value={formik.values.valorPago}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        { 
                            formik.touched.valorPago && formik.errors.valorPago ?
                            (
                                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                    { formik.errors.valorPago }
                                </span>
                            ) : null
                        }
                    </div>
                    <div
                        className="md:pl-6 mb-6"
                    >
                        <label
                        htmlFor="plazo"
                        className="text-xs font-bold"
                        >Plazo</label>
                        <input
                            id="plazo"
                            className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                            placeholder="10"
                            name="plazo"
                            type="number"
                            min="0"
                            value={formik.values.plazo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        { 
                            formik.touched.plazo && formik.errors.plazo ?
                            (
                                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                    { formik.errors.plazo }
                                </span>
                            ) : null
                        }
                    </div>
                    <div
                    className="md:px-6 mb-6"
                  >
                    <label
                        htmlFor="tipoPlazo"
                        className="text-xs font-bold"
                    >Tipo Plazo</label>
                      <select
                        className="w-full pb-1 mt-2 text-sm border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg"
                        name="tipoPlazo"
                        value={formik.values.tipoPlazo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                          <option value='DIAS'>DIAS</option>
                          <option value='SEMANAS'>SEMANAS</option>
                          <option value='MESES'>MESES</option>
                      </select>
                      { 
                        formik.touched.tipoPlazo && formik.errors.tipoPlazo ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.tipoPlazo }
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
