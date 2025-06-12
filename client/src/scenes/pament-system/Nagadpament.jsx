import React from 'react'
import "./Depositsystem.css"
import { PiWalletBold } from "react-icons/pi";
import { CgClose } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
const Nagadpament = () => {
    const navigate=useNavigate();
    // ------------------bkash pament system
    const bkash_pament= async(e)=>{
        e.preventDefault();
        const {data}=await axios.post("http://localhost:6001/api/payment/nagad",{mid:"merchant1",orderId:"4532521213131",ip:"312313",payerId:"313rdwr13dasd1231ad23",amount:56660,currency:"BDT",redirectUrl:"https://admin.eassypay.com/bkash_api",callbackUrl:"https://admin.eassypay.com/bkash_api"},{ withCredentials: true },{
              headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'x-api-key': "CDA990F26E7D765621178638A292EDB84FEE2D44E4ADA8DA8939DFF76DAD64D9",
      }
        });
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

export default Nagadpament