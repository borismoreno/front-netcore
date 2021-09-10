import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { startActualizarDetalleFactura } from '../../actions/factura';

const FilaDetalleFactura = ({ dato, handleDelete }) => {
    const dispatch = useDispatch();
    const [cantidad, setCantidad] = useState(dato.cantidad);
    const [subTotal, setSubTotal] = useState(0);
    const [valorUnitario, setValorUnitario] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [mostrarEliminar, setMostrarEliminar] = useState(false);
    useEffect(() => {
        const calculo = ()=> {
            let valUnitario = parseFloat(valorUnitario);
            if (!valUnitario) valUnitario = 0;
            const calc = parseFloat((parseFloat(cantidad) * valUnitario).toFixed(2));
            setSubTotal(calc);
            dispatch(startActualizarDetalleFactura(
                {
                    ...dato,
                    subtotal: calc
                }
            ))
        }
        calculo();

    }, [cantidad, valorUnitario, dispatch])

    const handleEnter = () => {
        setMostrarEliminar(true)
    }

    const handleOut = () => {
        setMostrarEliminar(false)
    }

    const deleteFila = () => {
        handleDelete(dato.id);
    }

    const handleChangeCantidad = async(e) => {
        setCantidad(e.target.value);
        dispatch(startActualizarDetalleFactura(
            {
                ...dato,
                cantidad: Number(e.target.value)
            }
        ))
    }

    const handleChangeValorUnitario = async(e) => {
        setValorUnitario(e.target.value);
        dispatch(startActualizarDetalleFactura(
            {
                ...dato,
                valorUnitario: e.target.value
            }
        ))
    }

    useEffect(() => {
        const asignar = () => {
            setValorUnitario(dato.valorUnitario);
            setCantidad(dato.cantidad);
        }
        asignar();
    }, [dato.valorUnitario, dato.cantidad])
    return ( 
        <tr
            key={dato.id}
            className="hover:bg-blue-50 border-b w-full"
            onMouseEnter={handleEnter}
            onMouseLeave={handleOut}
        >
            
            <td className='w-1/12 text-sm py-10 px-2'>{ dato.codigoPrincipal }</td>
            <td className='w-3/12 text-sm text-gray-600 font-light'>{ dato.descripcion }</td>
            <td className='w-1/12 text-gray-600 font-light px-4'>
                <input 
                    placeholder='Cantidad'
                    className='font-light text-sm bg-transparent focus:outline-none transition duration-300 focus:border-blue-300 text-right border-b-2 w-full px-1'
                    type="number"
                    autoComplete="off"
                    value={cantidad}
                    min={1}
                    onChange={handleChangeCantidad}
                    onFocus={e => e.target.select()}
                />
            </td>
            <td className='w-1/12 text-gray-600 font-light px-4'>
                <input 
                    
                    className='font-light text-sm bg-transparent focus:outline-none transition duration-300 focus:border-blue-300 text-right border-b-2 w-full px-1'
                    type="number"
                    autoComplete="off"
                    value={valorUnitario}
                    min={0}
                    onChange={handleChangeValorUnitario}
                    onFocus={e => e.target.select()}
                />
            </td>
            <td className='w-1/12 text-gray-600 font-light px-4'>
                <input 
                    
                    className='font-light text-sm bg-transparent focus:outline-none transition duration-300 focus:border-blue-300 text-right border-b-2 w-full px-1'
                    type="number"
                    autoComplete="off"
                    value={descuento}
                    min={0}
                    onChange={(e)=> setDescuento(e.target.value)}
                    onFocus={e => e.target.select()}
                    
                />
            </td>
            <td className='w-1/12 text-gray-600 font-light px-4'>
                <p className='text-sm text-center'>{subTotal}</p>
            </td>
            <td 
                className='w-1/12 text-sm text-gray-600 font-light px-2 text-left'
            >
                <button
                    className={`border border-red-400 focus:outline-none rounded-md w-full ${!mostrarEliminar ? 'hidden' : ''}`}
                    onClick={deleteFila}
                >
                    <i className='fas fa-trash w-full text-red-500 text-lg'></i>
                </button>
            </td>
        </tr>
     );
}
 
export default FilaDetalleFactura;