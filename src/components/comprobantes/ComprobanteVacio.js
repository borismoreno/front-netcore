import React from 'react'

export const ComprobanteVacio = () => {
    return (
        <div className="flex flex-col text-center text-gray-500 font-thin">
            <i className="fas fa-ban text-5xl mb-5"></i>
            <span className="text-4xl">No existen comprobantes.</span>
        </div>
    )
}
