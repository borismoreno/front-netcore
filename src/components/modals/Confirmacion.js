import React from 'react';

const Confirmacion = ({ handleBorrar, handleCerrar, mensajeConfirmacion = '' }) => {
    return (
        <>
            <div 
                className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'
            >
                <div className="relative w-10/12 md:w-8/12 lg:w-5/12 my-6 pb-2 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                        <h3 className="font-light text-lg">
                            Confirmación
                        </h3>
                        <button
                            className="ml-auto border-0 float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => handleCerrar(false)}
                        >
                            <span className="bg-transparent text-gray-400 hover:text-gray-700 h-6 w-6 text-lg block outline-none focus:outline-none">
                            x
                            </span>
                        </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto">
                            <div
                                className="md:px-6 mb-4 flex"
                            >
                                <div className='w-1/6 text-left'>
                                    <i className='fas fa-exclamation-triangle text-3xl text-primarycolor'></i>
                                </div>
                                <div className='w-5/6'>
                                    <p className='text-lg font-light'>{mensajeConfirmacion}</p>
                                </div>
                            </div>
                            {/* <div
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
                                    autoFocus={true}
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
                            </div> */}
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                            <button
                                className="text-blue-500 background-transparent font-bold px-4 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 hover:bg-gray-200 hover:underline rounded"
                                type="button"
                                style={{ transition: "all .15s ease" }}
                                onClick={() => handleCerrar(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-red-500 text-white hover:bg-red-600 font-normal text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                type="button"
                                style={{ transition: "all .15s ease" }}
                                onClick={handleBorrar}
                            >
                                Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
}
 
export default Confirmacion;