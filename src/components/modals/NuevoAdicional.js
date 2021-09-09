import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { startAgregarAdicional } from '../../actions/factura';

export const NuevoAdicional = ({setShowModal}) => {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            nombreAdicional: '',
            valorAdicional: '',
        },
        validationSchema: Yup.object({
            nombreAdicional: Yup.string()
                            .min(3, 'El nombre debe tener al menos 3 caracteres.')
                            .required('El nombre es obligatorio.'),
            valorAdicional: Yup.string()
                            .required('El valor es obligatorio.'),
        }),
        onSubmit: datos => {
            setShowModal(false);
            dispatch(startAgregarAdicional({
              nombreAdicional: datos.nombreAdicional.toUpperCase(),
              valorAdicional: datos.valorAdicional.toUpperCase()
            }));
        }
    })
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
                    Agregar Dato Adicional
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
                    htmlFor="nombreAdicional"
                    className="text-xs font-bold"
                    >Nombre</label>
                      <input
                        id="nombreAdicional"
                        className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm uppercase"
                        placeholder="Nombre Dato Adicional"
                        name="nombreAdicional"
                        autoComplete="off"
                        autoFocus
                        value={formik.values.nombreAdicional}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      { 
                        formik.touched.nombreAdicional && formik.errors.nombreAdicional ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.nombreAdicional }
                            </span>
                        ) : null
                      }
                  </div>
                  <div
                    className="md:px-6 mb-6"
                  >
                    <label
                    htmlFor="valorAdicional"
                    className="text-xs font-bold"
                    >Valor</label>
                      <input
                        id="valorAdicional"
                        className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm uppercase"
                        placeholder="Valor Dato Adicional"
                        name="valorAdicional"
                        autoComplete="off"
                        value={formik.values.valorAdicional}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      { 
                        formik.touched.valorAdicional && formik.errors.valorAdicional ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.valorAdicional }
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
