import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { startBuscarTipoIdentificacion } from '../../actions/configuracion';
import { validarCedula, validarEmail, validarExistencia, validarRuc } from '../../helpers/validaciones';
import { startGuardarCliente } from '../../actions/clientes';

export const EditarCliente = ({setShowModal, setShowClientes, identificacionIngresada = ''}) => {
    const dispatch = useDispatch();
    const { tiposIdentificacion } = useSelector(state => state.configuracion);
    const { clientes } = useSelector(state => state.clientes);
    useEffect(() => {
        dispatch(startBuscarTipoIdentificacion());
    }, [dispatch]);
    const handleCerrar = () => {
        setShowModal(false);
        setShowClientes(true);
    }
    const formik = useFormik({
        initialValues: {
            numeroIdentificacion: identificacionIngresada,
            tipoIdentificacion: '',
            razonSocial: '',
            direccion: '',
            telefono: '',
            mail: ''
        },
        validationSchema: Yup.object({
            razonSocial: Yup.string()
                            .min(5, 'El nombre debe tener al menos 5 caracteres.')
                            .required('El nombre del cliente es obligatorio.'),
            tipoIdentificacion: Yup.string()
                                    .required('El tipo de identificación es obligatorio.'),
            numeroIdentificacion: Yup.string()
                                    .required('El número de identificación es obligatorio.')
                                    .when('tipoIdentificacion', {
                                        is: '05',
                                        then: Yup.string()
                                        .min(10, 'Ingrese un número de cédula válido.')
                                        .max(10, 'Ingrese un número de cédula válido.')
                                        .test('test-name', 'Ingrese un número de cédula válido.',
                                            function(numeroIdentificacion) {
                                                return validarCedula(numeroIdentificacion);
                                            }
                                        )
                                    })
                                    .when('tipoIdentificacion', {
                                        is: '04',
                                        then: Yup.string()
                                        .min(13, 'Ingrese un número de ruc válido.')
                                        .max(13, 'Ingrese un número de ruc válido.')
                                        .test('test-name', 'Ingrese un número de ruc válido.',
                                            function(numeroIdentificacion) {
                                                return validarRuc(numeroIdentificacion);
                                            }
                                        )
                                    })
                                    .test('test-name', 'Número de identificación ya existe.',
                                        function(numeroIdentificacion) {
                                            return validarExistencia(clientes, numeroIdentificacion);
                                        }
                                    ),
            direccion: Yup.string()
                            .min(5, 'La dirección debe tener al menos 5 caracteres')
                            .required('La dirección es obligatoria.'),
            telefono: Yup.number()
                            .typeError('Debe ser un número.')
                            .required('El teléfono es obligatorio.'),
            mail: Yup.string()
                        .min(5, 'El correo debe tener al menos 5 caracteres')
                        .required('El correo es obligatorio.')
                        .test('test-name', 'Ingrese un correo válido.',
                            function (mail) {
                                return validarEmail(mail);
                            }
                        )
        }),
        onSubmit: datos => {
          tiposIdentificacion.forEach(tipo => {
            if (tipo.codigo === datos.tipoIdentificacion) {
              datos.tipoIdentificacion = tipo._id
            }
          });
          datos.razonSocial = datos.razonSocial.toUpperCase();
          datos.direccion = datos.direccion.toUpperCase();
            dispatch(startGuardarCliente(datos));
            setShowModal(false);
        }
    })
    return (
        <>
            <div className="relative w-10/12 md:w-8/12 lg:w-5/12 my-6 pb-2 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-2xl font-semibold">
                    Agregar Cliente
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
                    htmlFor="numeroIdentificacion"
                    className="text-xs font-bold"
                    >Identificación</label>
                      <input
                        id="numeroIdentificacion"
                        className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                        placeholder="Número de identificación"
                        name="numeroIdentificacion"
                        autoComplete="off"
                        value={formik.values.numeroIdentificacion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      { 
                        formik.touched.numeroIdentificacion && formik.errors.numeroIdentificacion ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.numeroIdentificacion }
                            </span>
                        ) : null
                      }
                  </div>
                  <div
                    className="md:px-6 mb-6"
                  >
                    <label
                        htmlFor="tipoIdentificacion"
                        className="text-xs font-bold"
                    >Tipo Identificación</label>
                      <select
                        className="w-full pb-1 mt-2 text-sm border-b-2 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg"
                        name="tipoIdentificacion"
                        value={formik.values.tipoIdentificacion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                          <option value=''>--SELECCIONE--</option>
                          { tiposIdentificacion && tiposIdentificacion.map(item => (
                              <option key={item._id} value={item.codigo}>{item.tipoIdentificacion}</option>
                          )) }
                      </select>
                      { 
                        formik.touched.tipoIdentificacion && formik.errors.tipoIdentificacion ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.tipoIdentificacion }
                            </span>
                        ) : null
                      }
                  </div>
                  <div
                    className="md:px-6 mb-6"
                  >
                    <label
                    htmlFor="razonSocial"
                    className="text-xs font-bold"
                    >Nombre Cliente</label>
                      <input
                        id="razonSocial"
                        className="uppercase w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                        placeholder="Nombre Cliente"
                        autoComplete="off"
                        name="razonSocial"
                        value={formik.values.razonSocial}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      { 
                        formik.touched.razonSocial && formik.errors.razonSocial ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.razonSocial }
                            </span>
                        ) : null
                      }
                  </div>
                  <div
                    className="md:px-6 mb-6"
                  >
                    <label
                    htmlFor="direccion"
                    className="text-xs font-bold"
                    >Dirección</label>
                      <input
                        id="direccion"
                        className="uppercase w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                        placeholder="Dirección Cliente"
                        name="direccion"
                        autoComplete="off"
                        value={formik.values.direccion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      { 
                        formik.touched.direccion && formik.errors.direccion ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.direccion }
                            </span>
                        ) : null
                      }
                  </div>
                  <div
                    className="md:px-6 mb-6"
                  >
                    <label
                    htmlFor="telefono"
                    className="text-xs font-bold"
                    >Teléfono</label>
                      <input
                        id="telefono"
                        className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                        placeholder="Teléfono Cliente"
                        name="telefono"
                        autoComplete="off"
                        value={formik.values.telefono}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      { 
                        formik.touched.telefono && formik.errors.telefono ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.telefono }
                            </span>
                        ) : null
                      }
                  </div>
                  <div
                    className="md:px-6 mb-6"
                  >
                    <label
                    htmlFor="mail"
                    className="text-xs font-bold"
                    >Correo</label>
                      <input
                        id="mail"
                        className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 focus:shadow-lg mt-2 text-sm"
                        placeholder="Correo Cliente"
                        name="mail"
                        autoComplete="off"
                        value={formik.values.mail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      { 
                        formik.touched.mail && formik.errors.mail ?
                        (
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                { formik.errors.mail }
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
                    onClick={handleCerrar}
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
        </>
    )
}
