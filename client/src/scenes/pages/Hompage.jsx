import React from 'react'
import { NavLink } from 'react-router-dom'
const Hompage = () => {
  return (
    <header className='w-full h-[14vh] px-[100px] py-[30px] flex justify-between items-center'>
        <ul className='flex justify-center items-center gap-[30px]'>
            <li className='text-[18px] text-indigo-600'>
                <NavLink to="/login">Log In</NavLink>
            </li>
            <li className='text-[18px] text-indigo-600'>
                <NavLink to="/agent-registration">Agent Registration</NavLink>
            </li>
               <li className='text-[18px] text-indigo-600'>
                <NavLink to="/agent-login">Agent Login</NavLink>
            </li>
        </ul>
    </header>
  )
}

export default Hompage