import React, { useState, useRef } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Fade,
} from "@material-ui/core";
import { useNavigate, useParams  } from "react-router-dom";
import { Box, useTheme, useMediaQuery, Button } from "@mui/material";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Header from "components/Header";
import Select, { SelectChangeEvent } from '@mui/material/Select';

import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { paymentApi, generalApi } from "state/api";
import useStyles from "./styles";
import logo from "./easypay-logo.png";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import Swal from 'sweetalert2';
import { redirect } from "react-router-dom/dist";
import { capitalize } from "utilities/CommonUtility";
import { FiAlertTriangle } from "react-icons/fi";
import { FaMobileAlt } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { SiPayloadcms } from "react-icons/si";
import axios from "axios"
const Withdraw = () => {

  const [merchant_name,setmerchant_name]=useState("merchant1");
  const [order_id,setorder_id]=useState("sade");
  const [payee_id,setpayee_id]=useState("sdad");
  const [payee_account,setpayee_account]=useState();
  const [provider_name,setprovider_name]=useState();
  const [callback_url,setcallback_url]=useState("sdasd");
  const [currency_name,setcurrency_name]=useState("BDT");
  const [amount,set_amount]=useState();

  // -------------submit withdraw-----------
  const handleSubmit=(e)=>{
    e.preventDefault();
       if(!merchant_name || !order_id || !payee_id || !provider_name || !callback_url || !currency_name || !amount){
             Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: "Please fill up your information!",
            showConfirmButton: true,
          });   
       }
       if(merchant_name || order_id || payee_id || provider_name || callback_url || currency_name || amount){
             axios.post(`${process.env.REACT_APP_BASE_URL}/payment/payout`,{mid:merchant_name,orderId:order_id,payeeId:payee_id,payeeAccount:payee_account,provider:provider_name,callback_url,currency:currency_name,amount:amount}) 
             .then((res)=>{ 
              if(res.data.success){
                     Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: res.data.message,
                        showConfirmButton: true,
               });   
              } else{
                            Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: res.data.message,
            showConfirmButton: true,
          });   
              }
             }).catch((err)=>{
              console.log(err)
             })
       }
  }
  return (
    <section className='w-full h-[100vh] flex justify-center items-center'>
      <section className="w-[40%] p-[25px] h-auto border-[1px] border-[#eee] shadow-lg rounded-[5px]">
       <div className="title">
          <div className='w-full flex justify-between'>
              <div className="flex justify-start items-center gap-[10px]">
                  <img className='w-[100px]' src={logo} alt="logo" />
                  <h2 className="text-[22px] font-[600] text-[#C3C1E7]">Eassypay</h2>
            </div>
            <div>
               <h1 className='text-[18px] font-[600] mb-[3px]'>Merchant : <span className='text-[#0097e6]'>Rahim</span></h1>
               <h2 className='text-[18px] font-[600] mb-[3px]'>Player ID : <span className='text-[#4cd137]'>#31231sd</span></h2>
               <h2 className='text-[18px] font-[600] mb-[3px]'>Order ID : <span className='text-neutral-600'>#312313</span></h2>
            </div>
          </div>
         
       </div>
       <div className='mt-[15px]'>
         <h2 className='text-[22px] font-[600]'>Withdraw Information</h2>
          {/* <p className='text-[14px] text-neutral-800 flex justify-start items-center gap-[10px]'> <FiAlertTriangle className="text-[#fed330] text-[25px]"/>ফোন নম্বর যাচাই করা হয়নি, উত্তোলন করার আগে দয়া করে যাচাই করে নিন।</p> */}
       </div>
<form onSubmit={handleSubmit}>
  {/* Account Selection */}
    <div className="mb-4 mt-[20px]">
    <label htmlFor="account" className="block text-[17px] font-medium text-gray-700 ">Phone Number</label>
   <input type="number"placeholder="Enter your number"onChange={(e)=>{setpayee_account(e.target.value)}} className="w-full h-[50px] px-[15px] mt-[6px] rounded-[5px] text-[16px] border-[1px] border-[#eee]" />
  </div>
  {/* <div className="mb-4 mt-[10px]">
    <label htmlFor="account" className="block text-[17px] font-medium text-gray-700 ">Select Account</label>
    <select id="account" name="account" className="mt-[7px] px-[10px] block w-full h-[50px] text-[17px] rounded-md border-[#eee] shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
      <option value>-- Select Account --</option>
      <option value="bank">Bank Account</option>
      <option value="mobile">Mobile Wallet</option>
      <option value="crypto">Cryptocurrency Wallet</option>
    </select>
  </div> */}
  {/* Amount Input */}
  <div className="mb-4">
    <label htmlFor="amount" className="block text-[17px] font-medium text-gray-700 ">Withdraw Amount</label>
    <input type="number" id="amount" name="amount" placeholder="Enter amount"onChange={(e)=>{set_amount(e.target.value)}} className="mt-1 h-[50px] px-[15px] block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50" />
  </div>
  {/* Payment Method */}
  <div className="mb-4">
    <label htmlFor="method"className="block text-[17px] font-medium text-gray-700 ">Payment Method</label>
    <select id="method" name="method"onChange={(e)=>{setprovider_name(e.target.value)}} className="mt-1 block w-full h-[50px] rounded-md px-[15px] text-[16px] border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
      <option value>-- Select Method --</option>
      <option value="bkash">Bkash</option>
      <option value="nagad">Nagad</option>
      <option value="Rocket">Rocket</option>
    </select>
  </div>
  {/* Submit Button */}
  <div className="mt-6">
    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
      Withdraw Now
    </button>
  </div>
</form>

      </section>
    </section>
  )
}

export default Withdraw