import React, { useState,useEffect} from 'react';
import Swal from 'sweetalert2';
import { nanoid } from "nanoid";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
const WithdrawForm = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
   const user_info=JSON.parse(localStorage.getItem("admin_data"));
   const navigate=useNavigate();
//  ---------needed data--------------
  const [merchant_name,setmerchant_name]=useState("shihab");
  const [order_id,setorder_id]=useState("");
  const [player_id,set_playerid]=useState("");
  const [payeer_account,setpayeer_account]=useState();
  const [provider_name,setprovider_name]=useState();
  const [callback_url,setcallback_url]=useState("www.babu88.com");
  const [currency_name,setcurrency_name]=useState("BDT");
  const [amount,set_amount]=useState();
//  ---------needed data--------------
  useEffect(() => {
    setorder_id(nanoid(8));
    set_playerid(user_info.payer_id);
  },[]);
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
        axios.post(`${process.env.REACT_APP_BASE_URL}/payment/payout`,{mid:merchant_name,orderId:order_id,payeeId:player_id,payeeAccount:payeer_account,provider:provider_name,callbackUrl:callback_url,currency:currency_name,amount:amount}) 
             .then((res)=>{ 
              console.log(res)
              if(res.data.success){
                     Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: res.data.message,
                        showConfirmButton: true,
               });   
               navigate("/merchant-website")
              } else{
                            Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: res.data.message,
            showConfirmButton: true,
          });   
              }
             }).catch((err)=>{
                  Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.message,
            showConfirmButton: true,
          });  
             })
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-1/2 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Withdraw Funds</h2>
        <form onSubmit={handleWithdrawSubmit} className="space-y-6">
          
          {/* Withdrawal Amount */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Amount (৳)</label>
            <input
              type="number"
              onChange={(e) => set_amount(e.target.value)}
              placeholder="Enter withdrawal amount"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Withdrawal Method */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Withdrawal Method</label>
            <select
              onChange={(e) => setprovider_name(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bkash">Bkash</option>
              <option value="nagad">Nagad</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Account Number</label>
            <input
              type="text"
              onChange={(e) => setpayeer_account(e.target.value)}
              placeholder="Enter account number"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white rounded-md font-bold ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Withdraw'}
          </button>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-4 py-3 bg-red-500 text-white rounded-md font-bold hover:bg-red-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawForm;
