import React, { useState, useRef, useEffect } from "react";
import { FaRegCopy } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { paymentApi } from 'state/api';
import { capitalize } from 'utilities/CommonUtility';
import { FaClipboard } from 'react-icons/fa';
import { nanoid } from "nanoid";
import axios from "axios";

// Loading Animation Component
const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-yellow-500 rounded-full animate-spin"></div>
          {/* Inner ring */}
          <div className="absolute inset-4 border-4 border-t-indigo-300 border-r-purple-300 border-b-pink-300 border-l-yellow-300 rounded-full animate-spin-reverse"></div>
          {/* Center dot */}
          <div className="absolute inset-6 bg-white rounded-full"></div>
        </div>
        <p className="mt-4 text-white text-lg font-semibold">Loading Payment Details...</p>
      </div>
    </div>
  );
};

const Checkoutmain = () => {
  const navigate = useNavigate();
  const textFieldRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [agentAccount, setAgentAccount] = useState('8809876543210');
  const [payerAccount, setPayerAccount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paidStatus, setPaidStatus] = useState(0);
  const [payerAccountError, setPayerAccountError] = useState('');
  const [transactionIdError, setTransactionIdError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [walletNumber, setWalletNumber] = useState('');
  const { paymentId } = useParams();
  const [randomAgent, setRandomAgent] = useState([]);
  const [websiteUrl, setWebsiteUrl] = useState(''); // Add state for website URL

  // const fetchRandomAgent = () => {
  //   axios.get(`${process.env.REACT_APP_BASE_URL}/user/checkout-page-agent/hobet`,{paymentId})
  //     .then((res) => {
  //       setRandomAgent(res.data);
  //       setWalletNumber(res.data.accountNumber);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      setShowContent(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showContent) {
      setIsLoading(true);
      paymentApi.payment()
        .checkout({ paymentId })
        .then(res => {
          if (res.data.success) {
            console.log("ss",res)
            setProvider(res.data.data.provider);
            setAmount(res.data.data.amount);
            setCurrency(res.data.data.currency);
            setWalletNumber(res.data.agent.accountNumber);
            setWebsiteUrl(res.data.data.websiteUrl || 'https://example.com'); // Set the website URL from response or default
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: res.data.message,
              showConfirmButton: true,
            });
            setPaidStatus(2);
          }
          setIsLoading(false);
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.message,
            showConfirmButton: true,
          });
          setPaidStatus(2);
          setIsLoading(false);
        });
    }
  }, [paymentId, showContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePayerAccountChange = (e) => {
    setPayerAccount(e.target.value);
    if (!/^[0-9]{11}$/.test(e.target.value)) {
      setPayerAccountError('Please enter a valid 11-digit account number');
    } else {
      setPayerAccountError('');
    }
  };

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
    if (!e.target.value) {
      setTransactionIdError('Please enter a transaction ID');
    } else {
      setTransactionIdError('');
    }
  };
 const [transactiondata,settransactiondata]=useState([])
  const handleSubmit = async () => {
    if (!payerAccount || !/^[0-9]{11}$/.test(payerAccount)) {
      setPayerAccountError('Please enter a valid 11-digit account number');
      return;
    }

    if (!transactionId) {
      setTransactionIdError('Please enter a transaction ID');
      return;
    }

    setShowLoader(true);
    setIsLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/payment/paymentSubmit`, {
        paymentId,
        provider: provider,
        agentAccount: walletNumber,
        payerAccount,
        transactionId
      });

      setShowLoader(false);
      setIsLoading(false);

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your payment has been received.',
          showConfirmButton: true,
        });
        settransactiondata(res.data.data)
        setPaidStatus(1);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: res.data.message,
          showConfirmButton: true,
        });
        if (res.data.type === 'tid') {
          setTransactionIdError(res.data.message);
        } else if (res.data.type === 'pid') {
          setPaidStatus(2);
        }
      }
    } catch (err) {
      setShowLoader(false);
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while processing your payment',
        showConfirmButton: true,
      });
      console.error(err);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Redirecting...',
      text: 'You are being redirected to the homepage',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      navigate('/');
    });
  };

  const goToWebsite = () => {
    window.location.href = transactiondata.redirectUrl; // Navigate to the website URL
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {showLoader && <LoadingAnimation />}
      
      {showContent && (
        <div className="bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-800 text-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-6xl flex flex-col md:flex-row">
          {/* Left Section - Form */}
          <div className="w-full md:w-2/3 bg-white text-gray-800 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center tracking-wide text-gray-800">
              Payment {amount} {currency} in {capitalize(provider)}
            </h2>

            {paidStatus === 1 ? (
              <div className="text-center py-8">
                <div className="mb-6">
           <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-800 mt-4">Payment Successful!</h3>
                  <p className="text-gray-600 mt-2">Your payment has been processed successfully.</p>
                </div>
                <button
                  onClick={goToWebsite}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-bold"
                >
                  GO TO WEBSITE
                </button>
              </div>
            ) : (
              <>
                {/* Wallet Number */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">
                    Wallet No <span className="block text-sm text-gray-500">ওয়ালেট নম্বর</span>
                  </label>
                  <div className="flex items-center rounded-lg p-2 bg-gray-100 shadow-inner">
                    <input
                      type="text"
                      value={walletNumber}
                      readOnly
                      className="w-full bg-transparent border-none text-gray-800 outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className="ml-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                      title="Copy to clipboard"
                    >
                      <FaRegCopy size={20} />
                    </button>
                    {isCopied && (
                      <span className="ml-2 text-sm text-green-500">Copied!</span>
                    )}
                  </div>
                </div>

                {/* Wallet Provider */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">
                    Wallet Provider
                    <span className="block text-sm text-gray-500">ওয়ালেট প্রদানকারী</span>
                  </label>
                  <div className="border flex justify-start items-center text-[17px] rounded-[5px] h-[50px] px-[20px] bg-gray-100 shadow-inner">
                    {capitalize(provider)} Cashout
                  </div>
                </div>

                {/* Payer Account No */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">
                    Payer Account No*
                    <span className="block text-sm text-gray-500">পেয়ার অ্যাকাউন্ট নম্বর</span>
                  </label>
                  <input
                    type="text"
                    value={payerAccount}
                    onChange={handlePayerAccountChange}
                    placeholder="Enter your 11-digit account number"
                    className={`w-full border ${payerAccountError ? 'border-red-500' : 'border-neutral-300'} rounded-[5px] h-[50px] p-2 outline-none bg-gray-100 shadow-inner`}
                  />
                  {payerAccountError && <p className="text-red-500 text-xs mt-1">{payerAccountError}</p>}
                </div>

                {/* Transaction ID */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">
                    Transaction ID*
                    <span className="block text-sm text-gray-500">লেনদেন নম্বর</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={handleTransactionIdChange}
                    placeholder="Enter your transaction ID"
                    className={`w-full border ${transactionIdError ? 'border-red-500' : 'border-neutral-300'} rounded-[5px] h-[50px] p-2 outline-none bg-gray-100 shadow-inner`}
                  />
                  {transactionIdError && <p className="text-red-500 text-xs mt-1">{transactionIdError}</p>}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    disabled={isLoading}
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-md hover:bg-yellow-500 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'PROCESSING...' : 'SUBMIT'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Section - Information */}
          <div className="w-full md:w-1/3 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">{capitalize(provider)} Cashout</h3>
            <p className="text-sm leading-relaxed mb-6">
              দয়া করে মনে রাখবেন যে আপনি {capitalize(provider)} Cashout এ আমানত করবেন। নিশ্চিত হন যে
              আপনি একই ওয়ালেট থেকে অর্থপ্রদান করেছেন, অন্যথায় এটি হারিয়ে যেতে পারে।
            </p>

            <h3 className="text-xl font-semibold mb-4">Warning সতর্কতা</h3>
            <p className="text-sm leading-relaxed">
              Please note that you make a deposit to {capitalize(provider)} Cashout. Be sure that you
              make the payment from the same wallet, otherwise it may be lost.
              <br />
              <br />
              Please make sure that your deposit amount must be at least <strong>{amount} {currency}</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkoutmain;