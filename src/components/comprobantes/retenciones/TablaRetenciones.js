import React from 'react';
import MenuAcciones from './MenuAcciones';
import { NavLink } from 'react-router-dom';

const initialData = [];

const TablaRetenciones = ({data = initialData}) => {
    return ( 
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                        <tr>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Cliente</th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Número</th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Fecha Emisión</th>
                            {/* <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Valor</th> */}
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >Estado</th>
                            <th
                                className="px-6 bg-blue-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            ></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(item => (
                                <tr
                                    key={item.facturaId}
                                    className="border-b-2 hover:bg-blue-50"
                                >
                                    <td 
                                        className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-blue-400 hover:underline"
                                    >
                                        <NavLink to={`/retenciones/retencion/${item.facturaId}`}>{item.nombre}</NavLink>
                                    </td>
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{item.numero}</td>
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{item.fecha}</td>
                                    {/* <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{item.valor}</td> */}
                                    <td className="border-t-0 px-6 max-w-sm align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-gray-500">{item.estado}</td>
                                    <td>
                                        <MenuAcciones
                                            claveAcceso={item.claveAcceso}
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
     );
}
 
export default TablaRetenciones;