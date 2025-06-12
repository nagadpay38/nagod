import React from 'react'
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import "./Homeheader.css"
import { NavLink } from 'react-router-dom';
const Homeheader = () => {
  return (
    <header>
        <section className='subheader'>
            <div className='submenu'>
                <div className='info-box'>
                    <IoCall size={20} color="white"/>
                    <span>01777308777</span>
                </div>
                   <div className='info-box'>
                    <MdEmail size={20} color="white"/>
                    <span> help@creativeitinstitute.com</span>
                </div>
            </div>
        </section>
        <nav>
            <div className="logo">
                <img src="https://admin.eassypay.com/static/media/easypay-logo.f538d670857a9bc36f55.png" alt="" />
                 <h1>EasyPay</h1>
            </div>
            <ul>
                <li>
                    <NavLink>Home</NavLink>
                </li>
                <li>
                    <NavLink>About Us</NavLink>
                </li>
                <li>
                    <NavLink>Story</NavLink>
                </li>
                <li>
                    <NavLink>Contact</NavLink>
                </li>
                    <li>
                    <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                    <NavLink>
                        <button>Account</button>
                    </NavLink>
                </li>
                
            </ul>
        </nav>
    </header>
  )
}

export default Homeheader