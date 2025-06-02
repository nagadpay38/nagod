import React from 'react'
import "./Depositsystem.css"
import { PiWalletBold } from "react-icons/pi";
import { CgClose } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
const Depositsystem = () => {
    const navigate=useNavigate();
  return (
    <section className='deposit-main'>
        <section className='pament-option'>
            <div className='deposit-tit'>
                <div className='deposit-text'>
                    <PiWalletBold size={30}/>
                    <p>Deposit</p>
                </div>
                <button onClick={()=>{navigate("/dashboard")}}>
                    <CgClose/>
                </button>
            </div>
            <div className="deposit-option">
                    <button>Deposit</button>
                    <button>Withdraw</button>
            </div>
            <div className='pament-option2'>
                <div className='text1'>
                    <h2>Please choose a method</h2>
                </div>
                <div className='deposit-box'>
                    <NavLink to="/deposit-system/bkash">
                         <div>
                        <img src="https://xxxbetgames.com/icons-xxx/payments/69.svg" alt="" />
                        <h2>Bkash</h2>
                    </div>
                    </NavLink>

               
                    <NavLink to="/deposit-system/nagad">
                        <div>
                        <img src="https://xxxbetgames.com/icons-xxx/payments/89.svg" alt="" />
                        <h2>Nagad</h2>
                    </div>
                    </NavLink>

                       
                </div>
            </div>
        </section>
    </section>
  )
}

export default Depositsystem