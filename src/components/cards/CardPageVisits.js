import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tabla } from '../ui/Tabla';
function add(accumulator, a) {
  return accumulator + Number(a.totalVentas);
}

const headers = [
  'Cliente',
  'Total Ventas',
  'Porcentaje'
]
export const CardPageVisits = () => {
    const { topClientes } = useSelector(state => state.dashboard);
    const [registros, setRegistros] = useState([]);
    useEffect(() => {
      if ( Array.isArray(topClientes) ) {
        const arreglo = topClientes.map(cliente => {
          return {
            cliente: cliente._id.cliente,
            totalVentas: cliente.totalVentas.$numberDecimal,
          };
        });
        const sum = arreglo.reduce(add, 0);
        const data = arreglo.map(item => {
          const porcentaje = ((item.totalVentas / sum) * 100).toFixed(2) + ' %';
          return{
            ...item,
            porcentaje
          }
        })
        setRegistros(data);
      }
    }, [topClientes])
    return (
      <Tabla 
        titulo="Ventas por Cliente"
        data={registros}
        headers={headers}
      />
    )
}
