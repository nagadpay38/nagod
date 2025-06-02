import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Swal from 'sweetalert2';
import { FaCheck, FaArrowLeft } from "react-icons/fa6"; // Added FaArrowLeft for back button
import { Contextapi } from 'context/Appcontext';
import Dashboardleftside from 'components/agentcomponents/Dashboardleftside';
import Dashboradheader from 'components/agentcomponents/Dashboardheader';
import { MdContentCopy } from "react-icons/md";
import btc_img from "../../assets/bitcoin.png"
import usdt_img from "../../assets/usdt.png"
import toast, { Toaster } from 'react-hot-toast';
import { FiAlertCircle } from "react-icons/fi";

const Depositpage = () => {
       const agent_info=JSON.parse(localStorage.getItem("agent_info"));
     const {activesidebar,setactivesidebar,setactivetopbar}=useContext(Contextapi);

     const [copynumber,setcopynumber]=useState("")
     const [copynumber2,setcopynumber2]=useState("")

        useEffect(()=>{
     window.addEventListener("scroll",()=>{
      if(window.scrollY > 100){
             setactivetopbar(true)
      }else{
             setactivetopbar(false)
      }
     })
   },[]);
    function handlesidebar(){
        setactivesidebar(!activesidebar)
    }
    // active logout popup
    const [popup,setpopup]=useState(false);
useEffect(() => {
  // set agent number from localStorage
  setpayer_number(agent_info.accountNumber);

  // fetch wallet data
  axios.get(`${process.env.REACT_APP_BASE_URL2}/api/general/walletaddress`)
    .then(res => {
      console.log(res)
      if (res.data.success) {
        setcopynumber(res.data.data.usdtAddress);
        setcopynumber2(res.data.data.btcAddress);
        setusdt_address(res.data.data.usdtAddress);
        set_btcaddress(res.data.data.btcAddress);
      } else {
        console.log(res.data)
        toast.error("Failed to load wallet addresses.");
      }
    })
    .catch(err => {
      // toast.error("Error fetching wallet addresses.");
      console.log(err);
    });
}, []);

    // ----------------------handle pre-deposit-----------
    const [provider_name,setprovider_name]=useState("USDT");
    const [deposit_name,setdeposit_name]=useState("");
    const handleprovider=()=>{
      if(provider_name=="USDT"){
             setdeposit_name("USDT")
      }else if(provider_name=="BTC"){
             setdeposit_name("BTC")
      }
    }
    
    // Function to go back to payment method selection
    const handleBack = () => {
      setdeposit_name("");
    };
    
    const bkash_pament= async(e)=>{
        e.preventDefault();
        const {data}=await axios.post("http://localhost:6001/api/payment/bkash",{mid:"merchant1",orderId:"342sdad34234234",payerId:"3424dsd214234",amount:500,currency:"BDT",redirectUrl:"http://localhost:3000/dashboard",callbackUrl:"https://admin.eassypay.com/bkash_api"},{ withCredentials: true });
            window.location.href = data.link
        console.log(data)
    }
  
    // ----------handlecopy
    const [copy_success,setcopy_success]=useState(false);
    const handlecopy=(e)=>{
      e.preventDefault();
        navigator.clipboard.writeText(copynumber);
        setcopy_success(true);
        setTimeout(() => {
          setcopy_success(false)
        }, 2000);
    };
        const handlecopy2=(e)=>{
      e.preventDefault();
        navigator.clipboard.writeText(copynumber2);
        setcopy_success(true);
        setTimeout(() => {
          setcopy_success(false)
        }, 2000);
    };
    // agent bkash deposit system
    // agent_number,provider_name,amount,payer_number,transition_id,user_id
    const [usdt_address,setusdt_address]=useState("");
    const [amount,setamount]=useState("");
    const [payer_number,setpayer_number]=useState("");
    const [transition_id,settransition_id]=useState("");
    const [errortext,seterrortext]=useState("");
// TR3vwDh67sC8inPYA2dNUZuQK7o3C49K7i
      // ----------------agent deposit information
    const agent_id=agent_info._id;
    useEffect(()=>{
        setpayer_number(agent_info.accountNumber);
    },[]);
    const USDT_deposit=(e)=>{
          e.preventDefault();
       if(usdt_address=="" || provider_name=="" || amount=="" || payer_number=="" || transition_id==""){
                seterrortext("Please fill up your information!")
       }else if(!usdt_address=="" || !provider_name=="" || !amount=="" || !payer_number=="" || !transition_id==""){
           axios.post(`${process.env.REACT_APP_BASE_URL2}/agent-deposit-money`,{usdt_address,provider_name,amount,payer_number,transition_id,agent_id})
                .then((res)=>{
                    if(res.data.success==true){
                         Swal.fire({
          icon: 'success',
          title: 'Deposit',
          text:res.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        seterrortext("")
                    }else{
                              Swal.fire({
          icon: 'error',
          title: 'Deposit',
          text:res.data.message,
          showConfirmButton: false,
          timer: 2000,
        });
                    }
                }).catch((err)=>{
                    toast.error(err.name)
                })
      }
    }
  //  --------------------BTC_deposit------------
    const [btc_address,set_btcaddress]=useState("")
      const BTC_deposit=(e)=>{
          e.preventDefault();
       if(btc_address=="" || provider_name=="" || amount=="" || payer_number=="" || transition_id==""){
                seterrortext("Please fill up your information!")
       }else if(!btc_address=="" || !provider_name=="" || !amount=="" || !payer_number=="" || !transition_id==""){
           axios.post(`${process.env.REACT_APP_BASE_URL2}/agent-deposit-money`,{usdt_address,provider_name,amount,payer_number,transition_id,agent_id})
                .then((res)=>{
                    if(res.data.success==true){
                         Swal.fire({
          icon: 'success',
          title: 'Deposit',
          text:res.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        seterrortext("")
                    }else{
                              Swal.fire({
          icon: 'error',
          title: 'Deposit',
          text:res.data.message,
          showConfirmButton: false,
          timer: 2000,
        });
                    }
                }).catch((err)=>{
                    toast.error(err.name)
                })
      }
    }
  return (
    <section className='w-full h-[100vh] flex font-poppins'>
        <section className={activesidebar ? 'lg:w-[7%] h-[100vh] transition-all duration-300 overflow-hidden':'w-0 md:w-[17%] transition-all duration-300 h-[100vh]'}>
            <Dashboardleftside/>
            <Toaster/>
        </section>
        <section className={activesidebar ? 'w-[100%] lg:w-[93%] h-[100vh] bg-[#EFEFFD] overflow-y-auto transition-all duration-300':' transition-all bg-[#EFEFFD] duration-300 w-[100%] overflow-y-auto md:w-[83%] h-[100vh]'}>
        <Dashboradheader/> 
       <section className='w-[100%] m-auto py-[20px] xl:py-[20px] px-[10px] lg:px-[20px]'>
             <section className={deposit_name === "" ? "bg-white rounded-xl shadow-md p-6 md:p-8 w-full max-w-3xl mx-auto" : "hidden"}>
  <div className="space-y-6">
    {/* Header Section */}
    <div className="space-y-2">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Deposit Funds</h1>
      <p className="text-gray-600 text-base md:text-lg">Please choose a payment method</p>
    </div>

    {/* Payment Method Selection */}
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Select Currency</h3>
      <div className="flex flex-wrap gap-4">
        {/* BTC Option */}
        <div 
          onClick={() => setprovider_name("BTC")}
          className={`w-24 h-24 flex flex-col items-center justify-center rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            provider_name === "BTC" 
              ? "border-yellow-400 bg-yellow-50 shadow-md" 
              : "border-gray-200 hover:border-yellow-300"
          }`}
        >
          <img 
            src={btc_img} 
            alt="Bitcoin" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain" 
          />
          <span className="mt-2 text-sm font-medium text-gray-700">Bitcoin</span>
        </div>

        {/* USDT Option */}
        <div 
          onClick={() => setprovider_name("USDT")}
          className={`w-24 h-24 flex flex-col items-center justify-center rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            provider_name === "USDT" 
              ? "border-emerald-500 bg-emerald-50 shadow-md" 
              : "border-gray-200 hover:border-emerald-400"
          }`}
        >
          <img 
            src={usdt_img} 
            alt="USDT" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain" 
          />
          <span className="mt-2 text-sm font-medium text-gray-700">USDT</span>
        </div>
      </div>
    </div>

    {/* Form Inputs */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Agent Number Input */}
      <div className="space-y-1">
        <label htmlFor="agentNumber" className="block text-sm font-medium text-gray-700">
          Your Number
        </label>
        <input
          type="number"
          id="agentNumber"
          placeholder="Enter agent number"
          value={payer_number}
          onChange={(e) => setpayer_number(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
        />
      </div>

      {/* Agent Name Input (disabled) */}
      <div className="space-y-1">
        <label htmlFor="agentName" className="block text-sm font-medium text-gray-700">
          Your Name
        </label>
        <input
          type="text"
          id="agentName"
          placeholder="Enter your name"
          value={agent_info.name}
          disabled
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
        />
      </div>
    </div>

    {/* Submit Button */}
    <button
      onClick={handleprovider}
      disabled={!provider_name || !payer_number}
      className="w-full py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Proceed to Deposit
    </button>
  </div>
</section>
                {/* -----------------deposit box--------------- */}
             <section className={deposit_name === "" ? "hidden" : "w-full lg:w-3/4 mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200"}>
  {/* Header Section with Back Button */}
  <div className="flex items-start mb-6">

    <div className="flex-1">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Deposit Information</h1>
      <p className="text-gray-500 mt-1">Complete your {deposit_name} deposit</p>
          <button 
      onClick={handleBack}
      className="flex items-center text-white px-[20px] py-[10px] text-[18px] rounded-[5px] mt-5 bg-[#20bf6b] hover:text-gray-800 mr-4"
    >
      <FaArrowLeft className="mr-2" />
      Back
    </button>
    </div>
    <div className="p-4 border-2 border-gray-100 rounded-lg bg-gray-50">
      {deposit_name === "USDT" ? (
        <img className="w-12 md:w-16" src={usdt_img} alt="USDT" />
      ) : (
        <img className="w-12 md:w-16" src={btc_img} alt="Bitcoin" />
      )}
    </div>
  </div>

  {/* USDT Deposit Form */}
  <form onSubmit={USDT_deposit} className={deposit_name === "USDT" ? "space-y-6" : "hidden"}>
    {/* Wallet Address */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">USDT Wallet Address</label>
      <div className="relative">
        <input
          type="text"
          placeholder="USDT Wallet Address"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 pr-14"
          disabled
          value={copynumber}
        />
        <button
          onClick={handlecopy}
          type="button"
          className={`absolute right-0 top-0 h-full px-4 w-[100px] flex items-center justify-center rounded-r-lg ${
            copy_success ? "text-green-500" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {copy_success ? <FaCheck size={20} /> : <MdContentCopy size={18} />}
        </button>
      </div>
      <p className="text-xs text-gray-500">Copy this address to send your USDT</p>
    </div>

    {/* Amount and Currency */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Deposit Amount ($)</label>
        <input
          type="number"
          onChange={(e) => setamount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Currency</label>
        <input
          type="text"
          disabled
          value="USDT"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
        />
      </div>
    </div>

    {/* Payer Number and Transaction ID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Payer Number</label>
        <input
          type="number"
          placeholder="Your phone number"
          value={payer_number}
          onChange={(e) => setpayer_number(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
        <input
          type="text"
          placeholder="From your wallet"
          onChange={(e) => settransition_id(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>
    </div>

    {/* Error Message */}
    {errortext && (
      <div className="p-3 bg-red-50 rounded-lg text-red-600 text-sm flex items-center">
        <FiAlertCircle className="mr-2" />
        {errortext}
      </div>
    )}

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
    >
      Confirm Deposit
    </button>
  </form>

  {/* BTC Deposit Form */}
  <form onSubmit={BTC_deposit} className={deposit_name === "BTC" ? "space-y-6" : "hidden"}>
    {/* Wallet Address */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">BTC Wallet Address</label>
      <div className="relative">
        <input
          type="text"
          placeholder="BTC Wallet Address"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 pr-14"
          disabled
          value={copynumber2}
        />
        <button
          onClick={handlecopy2}
          type="button"
          className={`absolute right-0 top-0 h-full px-4 w-[100px] flex items-center justify-center rounded-r-lg ${
            copy_success ? "text-green-500" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {copy_success ? <FaCheck size={20} /> : <MdContentCopy size={18} />}
        </button>
      </div>
      <p className="text-xs text-gray-500">Copy this address to send your BTC</p>
    </div>

    {/* Amount and Currency */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Deposit Amount (BTC)</label>
        <input
          type="number"
          onChange={(e) => setamount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Currency</label>
        <input
          type="text"
          disabled
          value="BTC"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
        />
      </div>
    </div>

    {/* Payer Number and Transaction ID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Payer Number</label>
        <input
          type="number"
          placeholder="Your phone number"
          value={payer_number}
          onChange={(e) => setpayer_number(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
        <input
          type="text"
          placeholder="From your wallet"
          onChange={(e) => settransition_id(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>
    </div>

    {/* Error Message */}
    {errortext && (
      <div className="p-3 bg-red-50 rounded-lg text-red-600 text-sm flex items-center">
        <FiAlertCircle className="mr-2" />
        {errortext}
      </div>
    )}

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
    >
      Confirm Deposit
    </button>
  </form>
</section>

       </section>
        </section>
    </section>
  )
}

export default Depositpage