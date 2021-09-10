import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startObtenerTarifasIva, startObtenerTiposProducto } from '../../actions/configuracion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { startMostrarCargandoAlerta } from '../../actions/alerta';
import { startAgregarProducto } from '../../actions/producto';

const NuevoProducto = ({setShowModal, descripcionInicial}) => {
    const dispatch = useDispatch();
    const { tiposProducto, tarifasIva } = useSelector(state => state.configuracion);
    const formik = useFormik({
      initialValues: {
          descripcion: descripcionInicial,
          idPrincipal: '',
          idSecundario: '',
          valorUnitario: 0,
          tipoProducto: '',
          tarifaIva: '',
      },
      validationSchema: Yup.object({
          descripcion: Yup.string()
                          .min(5, 'La descripción debe tener al menos 5 caracteres.')
                          .required('La descripción del producto es obligatoria.'),
          valorUnitario: Yup.number()
                              .required('El precio es obligatorio.')
                              .min(1, 'El precio es obligatorio'),
          tipoProducto: Yup.string()
                          .required('El tipo de producto es obligatorio.'),
          tarifaIva: Yup.string()
                          .required('La tarifa IVA es obligatoria.'),
      }),
      onSubmit: datos => {
        dispatch(startMostrarCargandoAlerta());
        dispatch(startAgregarProducto({
          codigoPrincipal: datos.idPrincipal.toUpperCase(),
          codigoAuxiliar: datos.idSecundario.toUpperCase(),
          descripcion: datos.descripcion,
          valorUnitario: datos.valorUnitario,
          tipoProducto: datos.tipoProducto,
          tarifaIva: datos.tarifaIva
        }))
      }
    });
    useEffect(() => {
      dispatch(startObtenerTiposProducto());
      dispatch(startObtenerTarifasIva());
    }, [dispatch]);
    return ( 
        <>
        <div 
            className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            // onClick={() => setShowModal(false)}
        >
            <div className="relative w-11/12 md:w-8/12 lg:w-5/12 my-32 pb-2 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-lg font-light">
                    Nuevo Producto
                  </h3>
                  <button
                    className="p-1 ml-auto border-0 text-black float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                    onClick={setShowModal}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-lg block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6">
                  <div
                    className="md:px-2 mb-6"
                  >
                    <label
                    htmlFor="descripcion"
                    className="text-xs font-bold"
                    >Descripción</label>
                      <input
                        id="descripcion"
                        className={`w-full border-b-2 pb-1 ${formik.touched.descripcion && formik.errors.descripcion ? 'border-red-300 ': 'border-gray-200 '} focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm text-gray-600`}
                        placeholder="Descripción Producto"
                        name="descripcion"
                        autoComplete="off"
                        autoFocus={true}
                        value={formik.values.descripcion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                  </div>
                  <div
                    className="md:px-2 mb-6 flex flex-col md:flex-row"
                  >
                      <div className='w-full md:w-1/3'>
                        <label
                        htmlFor="precio"
                        className="text-xs font-bold"
                        >Precio</label>
                        <div className='flex'>
                            <i className={`fas fa-dollar-sign ${formik.touched.valorUnitario && formik.errors.valorUnitario ? 'text-red-300': 'text-gray-400'} mr-2 mt-2 `}></i>
                            <input
                                id="valorUnitario"
                                className={`w-full pb-1 focus:outline-none mt-2 text-sm border-b-2 ${formik.touched.valorUnitario && formik.errors.valorUnitario ? 'border-red-300': 'border-gray-200'} focus:border-indigo-300 focus:shadow-lg text-right text-gray-600`}
                                placeholder="0.00"
                                name="valorUnitario"
                                type="number"
                                autoComplete="off"
                                value={formik.values.valorUnitario}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <p className='text-right text-sm text-gray-500'>Valor sin impuestos</p>

                      </div>
                      <div className='w-full md:w-2/3 md:ml-10'>
                        <label
                            htmlFor="idPrincipal"
                            className="text-xs font-bold"
                            >Código</label>
                            <div className='flex'>
                                <input
                                    id="idPrincipal"
                                    className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm text-gray-600 uppercase"
                                    placeholder="Código Principal"
                                    name="idPrincipal"
                                    autoComplete="off"
                                    value={formik.values.idPrincipal}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <p className='mt-2 mx-10'> - </p>
                                <input
                                    id="idSecundario"
                                    className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm text-gray-600 uppercase"
                                    placeholder="Código Auxiliar"
                                    name="idSecundario"
                                    autoComplete="off"
                                    value={formik.values.idSecundario}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                      </div>
                  </div>
                  <div
                    className="md:px-2 mb-6"
                  >
                    <label
                        htmlFor="tipoProducto"
                        className="text-xs font-bold"
                    >Tipo Producto</label>
                      <select
                        className={`w-full pb-1 mt-2 text-sm border-b-2 ${formik.touched.tipoProducto && formik.errors.tipoProducto ? 'border-red-300' : 'border-gray-200' }  focus:outline-none focus:border-indigo-300 focus:shadow-lg text-gray-600`}
                        name="tipoProducto"
                        value={formik.values.tipoProducto}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                          <option value='' key=''>--SELECCIONE--</option>
                          { tiposProducto && tiposProducto.map(item => (
                              <option key={item.id} value={item.id}>{item.descripcion}</option>
                          )) }
                      </select>
                  </div>
                  <div
                    className="md:px-2 mb-6"
                  >
                    <label
                        htmlFor="tipoProducto"
                        className="text-xs font-bold"
                    >Tarifa IVA</label>
                      <select
                        className={`w-full pb-1 mt-2 text-sm border-b-2 ${formik.touched.tarifaIva && formik.errors.tarifaIva ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:border-indigo-300 focus:shadow-lg text-gray-600`}
                        name="tarifaIva"
                        value={formik.values.tarifaIva}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                          <option value=''>--SELECCIONE--</option>
                          { tarifasIva && tarifasIva.map(item => (
                              <option key={item.id} value={item.id}>{item.porcentaje}</option>
                          )) }
                      </select>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 shadow-md border rounded-md hover:text-gray-400"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={setShowModal}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded-md shadow-md hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 border"
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
     );
}
 
export default NuevoProducto;