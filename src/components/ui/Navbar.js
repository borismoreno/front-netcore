import React from 'react';
import { CerrarSesion } from './CerrarSesion';
import { useSelector } from 'react-redux';
// import { MenuConfiguracion } from './MenuConfiguracion';

export const Navbar = () => {
    const { nombreComercial } = useSelector(state => state.auth);
    return (
        <>
      {/* Navbar */}
      <nav className="relative top-0 left-0 w-full z-auto bg-blue-600 md:flex-row md:flex-no-wrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-wrap-reverse flex-wrap md:px-10 px-4 h-10">
          {/* Brand */}
          <p
            className="text-blue-200 text-2xl uppercase hidden md:inline-block font-bold"
            // href="#pablo"
            // onClick={(e) => e.preventDefault()}
          >
            { nombreComercial }
          </p>
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
              <CerrarSesion />
            {/* <MenuConfiguracion /> */}
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
    )
}
