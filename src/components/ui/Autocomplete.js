import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { startCerrarModalProducto } from '../../actions/producto';

const Autocomplete = ({options, value, onChange, productoSeleccionado}) => {
    const dispatch = useDispatch();
    const [showOptions, setShowOptions] = useState(false)
    const [cursor, setCursor] = useState(-1)
    const ref = useRef();

    const select = option => {
        onChange(option.descripcion);
        setShowOptions(false);
        productoSeleccionado(option.id);
    }

    const nuevo = () => {
        setShowOptions(false);
        // onChange('');
        dispatch(startCerrarModalProducto(false));
        productoSeleccionado('nuevo');
    }

    const handleChange = text => {
        onChange(text);
        setCursor(-1);
        if(!showOptions) {
            setShowOptions(true)
        }
    }

    const filteredOptions = options.filter(option => option.descripcion.toLowerCase().includes(value.toLowerCase()))

    const moveCursorDown = () => {
        if(cursor < filteredOptions.length - 1) {
            setCursor(c => c + 1)
        }
    }

    const moveCursorUp = () => {
        if(cursor > 0) {
            setCursor(c => c - 1)
        }
    }

    const handleNav = (e) => {
        switch (e.key) {
            case 'Escape':
                setShowOptions(false);
                break;
            case "ArrowUp":
                moveCursorUp();
                break;
            case "ArrowDown":
                moveCursorDown();
                break;
            case "Enter":
                if(cursor >= 0 && cursor < filteredOptions.length) {
                    select(filteredOptions[cursor]);
                } else {
                    if (value.length > 0) {
                        productoSeleccionado('nuevo');
                        dispatch(startCerrarModalProducto(false));
                    }
                    setShowOptions(false);
                    // onChange('');
                }
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        const listener = e => {
            if(ref.current && !ref.current.contains(e.target)) {
                setShowOptions(false)
                setCursor(-1)
            }
        };
        
        document.addEventListener('click', listener)
        document.addEventListener('focusin', listener)
        return () => { 
            document.removeEventListener('click', listener); 
            document.removeEventListener('focusin', listener); 
        }
    },[]);
    return ( 
        <div className='flex w-full p-4 hover:bg-blue-50 transition duration-300'>
            <i className="fas fa-search text-gray-400 text-lg mr-4"></i>
            <div className="relative w-full" ref={ref} >
            
        <input type="text" className="bg-transparent focus:outline-none w-full text-gray-700" 
            autoComplete='off'
            name='producto'
            id='producto'
            value={value}
            placeholder='Agregar Producto'
            onChange={e => handleChange(e.target.value)}
            // onFocus={()=> setShowOptions(true)} 
            onKeyDown={handleNav}
            />

        <ul className={`absolute w-auto rounded-lg shadow-lg ${!showOptions && 'hidden'} select-none z-10 bg-white py-2`}>
            {filteredOptions.length > 0 ? filteredOptions.map((option, i, arr) => {
                let className = "px-4 py-2 hover:bg-blue-100 text-gray-700 text-sm "

                // if(i === 0)
                //     className += "pt-2 pb-1 rounded-t-lg"
                // else if(i === arr.length)
                //     className += "pt-1 pb-2 rounded-b-lg"
                // else if(i ===0 && arr.length === 1)
                //     className += "py-2 rounded-lg"
                // else 
                //     className += "py-1"

                if(cursor === i) {
                    className += " bg-blue-100"
                }

                return <li className={className} 
                    key={option.id}
                    onClick={() => select(option)}
                    >{option.descripcion}</li>
            }) : <li className="px-4 py-2 text-gray-500 bg-blue-100" onClick={nuevo}>Nuevo Producto - <strong className='text-gray-900'>{value}</strong> </li>}
            
        </ul>
    </div>
        </div>
        
     );
}
 
export default Autocomplete;