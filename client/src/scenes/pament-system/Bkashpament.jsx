import React from 'react'
import "./Depositsystem.css"
import { PiWalletBold } from "react-icons/pi";
import { CgClose } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
const Bkashpament = () => {
    const navigate=useNavigate();
    // ------------------bkash pament system
    const bkash_pament= async(e)=>{
        e.preventDefault();
        const {data}=await axios.post("http://localhost:6001/api/payment/bkash",{mid:"merchant1",orderId:"ssdasd323xczx",payerId:"342423wew44we214234",amount:56660,currency:"BDT",redirectUrl:"http://localhost:3000/dashboard",callbackUrl:"https://admin.eassypay.com/bkash_api"},{ withCredentials: true });
            window.location.href = data.link
            console.log(data)
    }
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
            <div className="diposit">
                  <form action=""onSubmit={bkash_pament}>
                    <div className="inp">
                        <label htmlFor="amount">Mobile</label><br />
                        <input type="number"placeholder='Enter your number' />
                    </div>
                      <div className="inp">
                        <label htmlFor="amount">Amount</label><br />
                        <input type="number"placeholder='Enter your amount' />
                    </div>
                    <button>Pay</button>
                  </form>
            </div>
        </section>
    </section>
  )
}

export default Bkashpament