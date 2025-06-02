import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { nanoid } from "nanoid";
import { useNavigate, useParams } from "react-router-dom";
import logo_img from "../../assets/easypay-logo.png";
import { paymentApi } from "state/api";
import axios from "axios"
function Checkoutdemo() {
  const navigate = useNavigate();
  const { merchant } = useParams();
  // State variables
  const [provider, setProvider] = useState("bkash");
  const [amount, setAmount] = useState("");
  const [currency] = useState("BDT");
  const [redirectUrl] = useState("http://localhost:3000/depositdemo");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [amountError, setAmountError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [payerId] = useState("m1-p-123");
  const [mid] = useState(merchant);
  const [paidStatus, setPaidStatus] = useState(0); // 0: initial, 1: success, 2: fail
  useEffect(() => {
    setOrderId(nanoid(8));
  },[]);

  const handleProviderChange = (event) => {
    setProvider(event.target.value);
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    setAmount(value);

    if (!value) {
      setAmountError("Please enter an amount to deposit.");
    } else if (isNaN(value) || Number(value) <= 0) {
      setAmountError("Amount must be a positive number.");
    } else {
      setAmountError("");
    }
  };

  const handleSubmit = async () => {
    if (!amount || amountError) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please check the input fields.",
        showConfirmButton: true,
      });
      return;
    }

    try {
      const res = await paymentApi
        .payment()
        .payment({ mid, provider, orderId, payerId, amount, currency, redirectUrl, callbackUrl });
      if (res.data.success) {
        window.location = res.data.link;
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res.data.message,
          showConfirmButton: true,
        });
      }

      setOrderId(nanoid(8));
      setAmount("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message,
        showConfirmButton: true,
      });
    }
  };

  const handleCancel = () => {
    Swal.fire({
      icon: "warning",
      title: "Warning!",
      text: "You are being redirected to your website.",
      showConfirmButton: true,
    });

    window.location = redirectUrl;
  };

  return (
    <section className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl overflow-hidden">
        {paidStatus === 0 && (
          <div className="p-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <img className="w-16 mb-4" src={logo_img} alt="logo" />
                <h1 className="text-2xl font-bold text-gray-800">Deposit Information</h1>
              </div>
              <div className="text-right">
                <h1 className="text-indigo-600 text-sm font-semibold">Merchant: {mid}</h1>
                <h1 className="text-sm text-gray-700 font-medium">Player ID: {payerId}</h1>
                <h1 className="text-sm text-gray-700 font-medium">Order ID: {orderId}</h1>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              {/* Provider Selection */}
              <div>
                <label className="block text-[16px] font-[500] text-gray-700 mb-2">Provider</label>
                <select
                  className="w-full px-4 py-3 border border-[#eee] rounded-[5px] focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  value={provider}
                  onChange={handleProviderChange}
                >
                  <option value="bkash">Bkash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                </select>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-[16px] font-[500]  text-gray-700 mb-2">
                  Amount (BDT)
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border ${
                    amountError ? "border-red-500" : "border-[#eee]"
                  } rounded-[5px] focus:ring-2 focus:ring-indigo-400 focus:outline-none`}
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                />
                {amountError && <p className="text-red-500 text-sm mt-2">{amountError}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                className="px-[30px] py-[13px] text-[16px] font-semibold text-white bg-red-600 rounded-[5px] hover:bg-gray-300 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-[30px] py-[13px] text-[16px] font-semibold text-white bg-indigo-600 rounded-[5px] hover:bg-indigo-700 transition"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Success or Failure Messages */}
        {paidStatus === 1 && (
          <div className="p-8 text-center">
            <p className="text-green-500 text-lg font-semibold">Your payment is received!</p>
            <button
              className="mt-6 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
              onClick={handleCancel}
            >
              Close Page
            </button>
          </div>
        )}
        {paidStatus === 2 && (
          <div className="p-8 text-center">
            <p className="text-red-500 text-lg font-semibold">
              Your payment has failed. Please try again later.
            </p>
            <button
              className="mt-6 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
              onClick={handleCancel}
            >
              Close Page
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Checkoutdemo;
