import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { paymentApi } from 'state/api';
import { capitalize } from 'utilities/CommonUtility';
import { FaClipboard } from 'react-icons/fa';
function Checkout() {
  const navigate = useNavigate();
  const textFieldRef = useRef(null);
  const { paymentId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [agentAccount, setAgentAccount] = useState('');
  const [payerAccount, setPayerAccount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paidStatus, setPaidStatus] = useState(0); // 0: initial, 1: success, 2: fail
  const [payerAccountError, setPayerAccountError] = useState('');
  const [transactionIdError, setTransactionIdError] = useState('');

  useEffect(() => {
    setIsLoading(true);

    paymentApi.payment()
      .checkout({ paymentId })
      .then(res => {
        if (res.data.success) {
          setProvider(res.data.data.provider);
          setAmount(res.data.data.amount);
          setCurrency(res.data.data.currency);
          setAgentAccount(res.data.data.agentAccount);
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
  }, [paymentId]);

  const handleCopy = () => {
    if (textFieldRef.current) {
      textFieldRef.current.select();
      document.execCommand('copy');
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        text: `Wallet number ${agentAccount} copied to clipboard.`,
        showConfirmButton: true,
      });
    }
  };

  const handlePayerAccountChange = (e) => {
    setPayerAccount(e.target.value);
  };

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
    if (!transactionId && !e.target.value) {
      setTransactionIdError('Please enter a transaction ID.');
    } else {
      setTransactionIdError('');
    }
  };

  const handleSubmit = async () => {
    if (!payerAccount || !/^[0-9]{11}$/.test(payerAccount)) {
      setPayerAccountError('Please enter a valid account number.');
    } else {
      setPayerAccountError('');
    }

    if (!transactionId) {
      setTransactionIdError('Please enter a transaction ID.');
    } else {
      setTransactionIdError('');
    }

    if (!payerAccount || payerAccountError || !transactionId || transactionIdError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    paymentApi.payment()
      .paymentSubmit({ paymentId, provider, agentAccount, payerAccount, transactionId })
      .then(res => {
        if (res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your payment is received.',
            showConfirmButton: true,
          });
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
        setIsLoading(false);
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err.message,
          showConfirmButton: true,
        });
        setIsLoading(false);
      });
  };

  const handleCancel = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Redirecting...',
      text: 'You are being redirected to your website.',
      showConfirmButton: true,
    });
    window.location = '/';
  };

  return (
<section className="w-full h-[100vh] flex justify-center items-center bg-gray-100 py-8">
  <div className="max-w-7xl mx-auto bg-white p-8 shadow-xl rounded-lg flex flex-col md:flex-row gap-8">
    {/* Left Section - Form */}
    <div className="w-full md:w-1/2 p-6">
      {paidStatus === 0 && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-[25px] font-bold text-gray-800 mb-2">
              {`Payment of ${amount} ${currency} in ${capitalize(provider)}`}
            </h2>
            <p className="text-gray-600 text-lg mt-2">Please enter the payment details below:</p>
          </div>

          {/* Agent Wallet Number */}
          <div className="mb-6">
            <label htmlFor="agentAccount" className="block text-[16px] font-[500] text-neutral-600 mb-2">
              Agent Wallet Number
            </label>
            <div className="relative">
              <input
                ref={textFieldRef}
                id="agentAccount"
                value={agentAccount}
                readOnly
                className="w-full px-[20px] h-[50px] border-[1px] border-[#eee] text-[17px] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ease-in-out "
              />
              <button
                onClick={handleCopy}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition duration-300"
                title="Copy to clipboard"
              >
                <FaClipboard className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Payer Account Number */}
          <div className="mb-6">
            <label htmlFor="payerAccount" className="block text-[16px] font-[500] text-neutral-600 mb-2">
              Payer Account Number *
            </label>
            <input
              type="text"
              id="payerAccount"
              value={payerAccount}
              onChange={handlePayerAccountChange}
              className="w-full px-[20px] h-[50px] border-[1px] border-[#eee] text-[17px] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ease-in-out"
              placeholder="Enter payer account number"
            />
            {payerAccountError && <p className="text-red-500 text-xs mt-1">{payerAccountError}</p>}
          </div>

          {/* Transaction ID */}
          <div className="mb-6">
            <label htmlFor="transactionId" className="block text-[16px] font-[500] text-neutral-600 mb-2">
              Transaction ID *
            </label>
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={handleTransactionIdChange}
              className="w-full px-[20px] h-[50px] border-[1px] border-[#eee] text-[17px] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ease-in-out"
              placeholder="Enter transaction ID"
            />
            {transactionIdError && <p className="text-red-500 text-xs mt-1">{transactionIdError}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-6 mt-6">
            <button
              onClick={handleCancel}
              className="px-[30px] py-[13px] bg-red-500 text-white rounded-[5px] text-[16px] hover:bg-red-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-[30px] py-[13px] bg-blue-500 text-white rounded-[5px] text-[16px] hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </>
      )}

      {/* Payment Received Status */}
      {paidStatus === 1 && (
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Your payment is received!</h2>
          <p className="text-lg text-gray-700 mb-6">Your payment is being processed. Please wait for verification.</p>
          <button onClick={handleCancel} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
            Close Page
          </button>
        </div>
      )}

      {/* Payment Failed Status */}
      {paidStatus === 2 && (
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h2>
          <p className="text-lg text-gray-700 mb-6">There was an issue with your payment. Please try again or contact support.</p>
          <button onClick={handleCancel} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
            Close Page
          </button>
        </div>
      )}
    </div>

    {/* Right Section - Document */}
    <div className="w-full md:w-1/2 p-6 bg-gray-50 ">
      <h3 className="text-[20px] font-bold text-gray-800 mb-4">Wallet Provider</h3>
      <p className="text-gray-700 mb-6">Please read the instructions carefully before proceeding with your payment.</p>
      <div className='w-auto px-[15px] py-[8px] border-[1px] border-[#eee] rounded-[5px] flex justify-start items-center gap-[8px]'>
        <img className='w-[50px]' src="http://localhost:3000/static/media/easypay-logo.f538d670857a9bc36f55.png"/>
        <h2 className='text-[20px] font-[500] text-neutral-700'>{capitalize(provider) + ' Cashout'}</h2>  
      </div> 
      <div className='mt-[20px]'>
        <h2 className='text-[18px] mb-[10px]'>Warning</h2>
        <p className='text-neutral-700 text-[16px] mb-[10px]'> দয়া করে মনে রাখবেন যে আপনি {capitalize(provider)} Cashout এ আমানত করেন। নিশ্চিত হন যে আপনি একই ওয়ালেট থেকে অর্থপ্রদান করেছেন, অন্যথায় এটি হারিয়ে যেতে পারে।</p>
       <p className='text-neutral-700 text-[16px] mb-[10px]'>   অনুগ্রহ করে নিশ্চিত করুন যে আপনার জমার পরিমাণ কমপক্ষে 300.00 BDT হতে হবে।</p>
      </div>
    </div>
  </div>
</section>

  );
}

export default Checkout;

