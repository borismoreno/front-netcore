import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startObtenerClientes, startSeleccionarCliente } from '../../actions/clientes';
import { Pagination } from '../ui/Pagination';

export const TablaClientes = ({ presentarTabla }) => {
    const dispatch = useDispatch();
    const [ idSeleccion, setIdSeleccion ] = useState('');
    const [ rowsPerPage, setRowsPerPage ] = useState(5);
    const [ identificacionBuscar, setIdentificacionBuscar ] = useState('');
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ clientesBusqueda, setClientesBusqueda ] = useState([]);
    const { clientes } = useSelector(state => state.clientes);
    useEffect(() => {
        dispatch(startObtenerClientes());
        setCurrentPage(1);
    }, [dispatch]);

    useEffect(() => {
        setClientesBusqueda(clientes);
    }, [clientes])

    const handleChangeInput = (e) => {
        setIdSeleccion(e.target.value);
    }

    const handleBuscar = async(e) => {
        setIdentificacionBuscar(e.target.value);
    }

    const handleSeleccionar = () => {
        const clienteSeleccionado = clientes.find(item => item._id === idSeleccion);
        dispatch(startSeleccionarCliente(clienteSeleccionado));
        presentarTabla(false);
    }

    useEffect(() => {
        const busqueda = () => {
            setClientesBusqueda(clientes
                .filter(cliente => cliente.numeroIdentificacion.toLowerCase().indexOf(identificacionBuscar.toLowerCase()) > -1))
        }
        busqueda();
    }, [identificacionBuscar, clientes])

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = clientesBusqueda.slice(indexOfFirstRow, indexOfLastRow);
    return (
        <>
            <div 
              className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0  z-50 outline-none focus:outline-none'
            >
            <div className="relative w-11/12 md:w-9/12 my-6 pb-2">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex flex-col md:flex-row items-start p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-2xl font-semibold md:w-1/5">
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
                  <div className='flex md:w-2/5 md:px-4 w-full mt-4 md:mt-0'>
                    <i
                        className="fas text-blue-400 fa-search mr-2 mt-2"
                    ></i>
                    <input
                        id="identificacionBuscar"
                        className="w-full border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 mt-2 text-sm"
                        autoComplete="off"
                        name="identificacionBuscar"
                        placeholder='Identificación a buscar'
                        value={identificacionBuscar}
                        onChange={handleBuscar}
                    />

                </div>
                <div className='md:w-2/5 flex justify-end mt-4 md:mt-0'>
                  <Pagination
                    rowsPerPage={rowsPerPage}
                    totalRows={clientesBusqueda.length}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setRowsPerPage={setRowsPerPage}
                    mostrarCombo={false}
                  />
                </div>
                </div>
                {/*body*/}
                <div className="relative py-4 px-2 md:px-6 flex-auto overflow-x-scroll">
                <table className="items-center w-full bg-transparent border-collapse ">
                    <thead>
                        <tr>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            ></th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Razón Social</th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Identificación</th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Correo</th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Teléfono</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentRows.map(cliente => {
                                return <tr
                                    key={cliente._id}
                                    className="border-b-2 hover:bg-blue-50"
                                    onChange={handleChangeInput}
                                >
                                    <td
                                        className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500"
                                    >
                                        <input type="radio" className="form-radio" name="idSeleccionado" value={cliente._id} />
                                    </td>
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs p-4 text-gray-500">{ cliente.razonSocial }</td>
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs p-4 text-gray-500">{ cliente.numeroIdentificacion }</td>
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs p-4 text-gray-500">{ cliente.mail }</td>
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs p-4 text-gray-500">{ cliente.telefono }</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-gray-300 rounded-b">
                  
                  <button
                    className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase disabled:opacity-40 text-sm px-6 py-3 rounded-3xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    disabled={idSeleccion === ''}
                    style={{ transition: "all .15s ease" }}
                    onClick={handleSeleccionar}
                  >
                    Seleccionar
                  </button>
                  <button
                    className="bg-red-500 text-white hover:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded-3xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={() => presentarTabla(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}
