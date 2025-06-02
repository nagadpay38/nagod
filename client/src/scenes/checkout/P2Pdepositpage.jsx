import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { nanoid } from "nanoid";
import { useNavigate, useParams } from "react-router-dom";
import logo_img from "../../assets/easypay-logo.png";

const P2Pdepositpage = () => {
  const navigate = useNavigate();
  const { merchant } = useParams();
  const user_info = JSON.parse(localStorage.getItem("admin_data"));

  // State variables
  const [selectedMethod, setSelectedMethod] = useState("bkash");
  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [payerId, setPayerId] = useState("");
  const [amountError, setAmountError] = useState("");
  const [paidStatus, setPaidStatus] = useState(0); // 0: initial, 1: success, 2: fail

  const redirectUrl = "http://localhost:3000/depositdemo";
  const currency = "BDT";

  useEffect(() => {
    setOrderId(nanoid(8));
    setPayerId(user_info?.payer_id || "default-payer-id");
  }, []);

  // Handlers
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    if (!value) {
      setAmountError("Please enter an amount.");
    } else if (isNaN(value) || Number(value) <= 0) {
      setAmountError("Amount must be a positive number.");
    } else {
      setAmountError("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedMethod) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a payment method!",
      });
      return;
    }

    if (!amount || amountError) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please check the input fields.",
      });
      return;
    }

    const postData = {
      provider: selectedMethod,
      amount: parseFloat(amount),
      mid: "shihab",
      orderId: orderId,
      currency: currency,
      payerId: payerId,
      redirectUrl: redirectUrl,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/payment/payment`,
        postData
      );
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Redirecting to payment...`,
        });
          navigate(`/checkout/${response.data.paymentId}`)
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.data.message || "Payment failed.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Something went wrong.",
      });
    }
  };

  const handleCancel = () => {
    Swal.fire({
      icon: "warning",
      title: "Cancelled",
      text: "Redirecting back to your website.",
    });
    navigate("/merchant-website");
  };

  // Render
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <img className="w-16" src={logo_img} alt="Logo" />
          <div className="text-right">
            {/* <h1 className="text-indigo-600 text-sm font-semibold">
              Merchant: {merchant || "Unknown"}
            </h1>
            <h1 className="text-sm text-gray-700 font-medium">
              Player ID: {payerId}
            </h1>
            <h1 className="text-sm text-gray-700 font-medium">
              Order ID: {orderId}
            </h1> */}
          </div>
        </div>

        {/* Form Section */}
        {paidStatus === 0 && (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <h2 className="text-lg font-medium text-gray-600 mb-2">
                Select Payment Method
              </h2>
              <div className="flex space-x-4">
                {["bkash", "nagad", "rocket"].map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => handleMethodSelect(method)}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border text-black font-medium transition-all duration-300 shadow-sm ${
                      selectedMethod === method
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                    }`}
                  >
                    <span>{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Enter Amount (BDT)
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  amountError
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
                placeholder="Enter amount"
              />
              {amountError && (
                <p className="text-red-500 text-sm mt-1">{amountError}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {/* Success or Failure Messages */}
        {paidStatus === 1 && (
          <div className="text-center">
            <p className="text-green-500 text-lg font-semibold">
              Your payment has been successfully processed!
            </p>
            <button
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={handleCancel}
            >
              Close
            </button>
          </div>
        )}
        {paidStatus === 2 && (
          <div className="text-center">
            <p className="text-red-500 text-lg font-semibold">
              Your payment has failed. Please try again.
            </p>
            <button
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={handleCancel}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default P2Pdepositpage;
