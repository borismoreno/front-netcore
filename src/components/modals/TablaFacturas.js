import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startMostrarError } from '../../actions/alerta';
import { startObtenerFacturasProcesadas } from '../../actions/comprobante';
import { Pagination } from '../ui/Pagination';

const TablaFacturas = ({setMostrarNueva, history}) => {
    const dispatch = useDispatch();
    const [ idSeleccion, setIdSeleccion ] = useState('');
    const [ rowsPerPage, setRowsPerPage ] = useState(10);
    const [ currentPage, setCurrentPage ] = useState(1);
    const { facturasProcesadas } = useSelector(state => state.comprobante);
    const { mostrarError } = useSelector(state => state.alerta);
    useEffect(() => {
        dispatch(startObtenerFacturasProcesadas());
        setCurrentPage(1);
    }, [dispatch]);
    const handleChangeInput = (e) => {
        setIdSeleccion(e.target.value);
    }
    const handleClick = () => {
        if (idSeleccion === '') {
          dispatch(startMostrarError('Por favor selecciona una factura para emitir la nota de crédito.'));
          return;
        }
        setMostrarNueva(false);
        history.push(`/notasCredito/nuevo/${idSeleccion}`);
    }
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = facturasProcesadas.slice(indexOfFirstRow, indexOfLastRow);
    return ( 
        <>
            <div 
              className={`justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 ${mostrarError ? 'z-40' : 'z-50'} outline-none focus:outline-none`}
            >
            <div className="relative w-11/12 md:w-9/12 my-6 pb-2">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
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
                  <Pagination
                    rowsPerPage={rowsPerPage}
                    totalRows={facturasProcesadas.length}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setRowsPerPage={setRowsPerPage}
                    mostrarCombo={false}
                  />
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                        <tr>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            ></th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >No. Documento</th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Cliente</th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Valor</th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentRows.map(factura => {
                                return <tr
                                    key={factura._id}
                                    className="border-b-2 hover:bg-blue-50"
                                    onChange={handleChangeInput}
                                >
                                    <td
                                        className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500"
                                    >
                                        <input type="radio" className="form-radio" name="idSeleccionado" value={factura._id} />
                                    </td>
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{ `${factura.estab}-${factura.ptoEmi}-${factura.secuencial}` }</td>
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{ factura.razonSocialComprador }</td>
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{ `$${factura.importeTotal}` }</td>
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{ factura.fechaEmision }</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-gray-300 rounded-b">
                  
                  <button
                    className="bg-blue-500 text-white hover:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded-3xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={handleClick}
                  >
                    Seleccionar
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
 
export default TablaFacturas;