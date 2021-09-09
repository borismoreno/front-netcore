import React from 'react';
import { useForm } from '../../hooks/useForm';
import { startLogin } from '../../actions/auth';
import { useDispatch } from 'react-redux';

export const LoginScreen = () => {
    const dispatch = useDispatch();
    const [ formValues, handleInputChange ] = useForm({
        usuario: '',
        password: ''
    });
    const { usuario, password } = formValues;

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(startLogin(usuario, password));
    }
    return (
        <>
            <img 
                className="fixed h-screen hidden md:block lg:block inset-0 w-full" 
                style={{zIndex: -1}}
                src="./assets/back.png" 
                alt="Imagen"
            />
            <div className="w-screen h-screen flex flex-col justify-center items-center lg:grid lg:grid-cols-2">
                <img 
                    className="hidden lg:block w-1/2 hover:scale-150 transition-all duration-500 transform mx-auto"
                    src="./assets/invoice.svg" 
                    alt="Imagen"
                />
                <form 
                    className="flex flex-col justify-center items-center w-screen sm:w-full md:w-6/12 lg:w-full"
                    onSubmit={handleSubmit}
                >
                    <img 
                        className="w-32"
                        src="./assets/avatar.svg" 
                        alt="Imagen"
                    />
                    <h2 className="my-8 font-bold text-3xl text-gray-700 text-center">Bienvenido</h2>
                    <div className="lg:w-6/12 md:w-11/12 sm:w-5/6 w-4/6">
                        <i className="fa fa-user absolute text-blue-400 text-xl"></i>
                        <input 
                            type="text"
                            className="pl-8 border-b-2 focus:outline-none focus:border-blue-400 text-lg w-full bg-transparent"
                            placeholder="Usuario"
                            name="usuario"
                            value={usuario}
                            onChange={handleInputChange}
                            autoComplete="off"
                        />
                    </div>
                    <div className="lg:w-6/12 md:w-11/12 sm:w-5/6 w-4/6 mt-8">
                        <i className="fa fa-lock absolute text-blue-400 text-xl"></i>
                        <input 
                            type="password"
                            className="pl-8 border-b-2 focus:outline-none focus:border-blue-400 text-lg w-full bg-transparent"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <input 
                        className="py-3 cursor-pointer px-20 bg-blue-400 rounded-full text-white font-bold uppercase text-lg mt-4 transform hover:translate-y-1 transition-all duration-500" 
                        type="submit"
                        value="Ingresar"
                    />
                </form>
            </div>
        </>
    );
}