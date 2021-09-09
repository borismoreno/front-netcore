import React from 'react'
import { NavLink } from 'react-router-dom'

export const SidebarV2 = () => {
    return (
        <div className='fixed w-14 h-full bg-gray-400 hover:w-72 z-20 overflow-hidden' style={{transition: '0.5s'}}>
            <ul className='absolute top-0 left-0 w-full'>
                <li className='relative w-full list-none'>
                    <NavLink
                        className='relative block w-full text-white'
                        to='/dashboard'
                    >
                        <span
                            className='relative block w-14 h-14 text-center'
                        ><i className='fas fa-tv' aria-hidden='true'></i></span>
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li className='relative w-full list-none'>
                    <NavLink
                        className='relative block w-full'
                        to='/dashboard'
                    >
                        <span
                            className='relative block w-14 h-14 text-center'
                        ><i className='far fa-list-alt' aria-hidden='true'></i></span>
                        <span>Dashboard</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}
