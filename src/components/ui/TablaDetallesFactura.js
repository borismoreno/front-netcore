import React from 'react';
import FilaDetalleFactura from './FilaDetalleFactura';

const TablaDetallesFactura = ({ data, handleDelete }) => {
    return ( 
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
                <tr>
                    <th 
                        className="px-6 bg-gray-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                        
                    >Codigo</th>
                    <th 
                        className="px-6 bg-gray-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                        
                    >Descripcion</th>
                    <th 
                        className="px-6 bg-gray-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                        
                    >Cantidad</th>
                    <th 
                        className="px-6 bg-gray-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                        
                    >Precio Unitario</th>
                    <th 
                        className="px-6 bg-gray-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                        
                    >Descuento</th>
                    <th 
                        className="p-6 bg-gray-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                        
                    >Subtotal</th>
                    <th
                        className="p-6 bg-gray-200 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                    ></th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map(dato => {
                        return <FilaDetalleFactura dato={dato} handleDelete={handleDelete} key={dato.id} />
                    })
                }
            </tbody>
          </table>
        </div>
     );
}
 
export default TablaDetallesFactura;