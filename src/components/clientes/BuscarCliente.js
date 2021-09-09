import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startSeleccionarCliente } from '../../actions/clientes';
import { EditarCliente } from '../modals/EditarCliente';

export const BuscarCliente = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [showClientes, setShowClientes] = useState(true);
    const { clientes, identificacionBuscar } = useSelector(state => state.clientes);
    const handleClick = (clienteSeleccionado) => {
        dispatch(startSeleccionarCliente(clienteSeleccionado));
    }

    const handleAgregarCliente = () => {
        setShowModal(true);
        setShowClientes(false);
    }

    useEffect(() => {
        setShowClientes(true);
    }, [identificacionBuscar]);
    return (
        <>
            {
                showClientes && 
                <div className="fixed bg-white px-4 z-10 border-gray-200 shadow-md border-2 mt-1 ml-1">
                    { clientes
                        .filter(({numeroIdentificacion}) => numeroIdentificacion.indexOf(identificacionBuscar.toLowerCase()) > -1)
                        .slice(0,5)
                        .map((v,i) => {
                            return (
                            <div 
                                key={i}
                                className="p-2 hover:bg-blue-300 cursor-pointer text-sm"
                                onClick={() => handleClick(v)}
                            >
                                <span><strong>{v.numeroIdentificacion}</strong></span>
                                <span>{` - ${v.razonSocial}`}</span>
                                <br />
                                <span>{v.mail}</span>
                            </div>)
                        })
                    }
                    <div>
                        <button
                            className="flex items-center p-2 hover:bg-blue-300 w-full focus:outline-none"
                            onClick={handleAgregarCliente}
                        >
                            <i className="fas fa-plus-circle mr-2"></i>
                            <p className="">Agregar Cliente</p>
                        </button>
                    </div>
                </div>
            }
            {
                showModal && 
                <>
                    <div 
                        className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        // onClick={() => setShowModal(false)}
                    >
                        <EditarCliente
                            setShowModal={setShowModal}
                            identificacionIngresada={identificacionBuscar}
                            setShowClientes={setShowClientes}
                        />
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            }
        </>
    )
}
