import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Contextapi } from 'context/Appcontext';
import Dashboardleftside from 'components/agentcomponents/Dashboardleftside';
import Dashboradheader from 'components/agentcomponents/Dashboardheader';
import toast, { Toaster } from 'react-hot-toast';

const Addbank = () => {
  const navigate = useNavigate();
  const { activesidebar, setactivesidebar, activetopbar, setactivetopbar } = useContext(Contextapi);
  const [walletType, setWalletType] = useState(''); // 'p2p' or 'p2c'
  const [providerType, setProviderType] = useState(''); // 'bkash' or 'nagad'
  const [loading, setLoading] = useState(false);
  const agent_info = JSON.parse(localStorage.getItem("agent_info"));

  // P2P Form State
  const [p2pForm, setP2pForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    merchant_name: '',
    mfs: '',
    currency: '',
    accountNumber: '',
    limitAmount: 1500000,
    createdby_id: agent_info._id
  });

  // P2C Form State (Bkash)
  const [bkashForm, setBkashForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    accountName: '',
    accountNumber: '',
    username: '',
    appKey: '',
    appSecretKey: '',
    limitAmount: 1000000,
    merchant_name: '',
    createdby_id: agent_info._id
  });

  // P2C Form State (Nagad)
  const [nagadForm, setNagadForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    accountName: '',
    accountNumber: '',
    username: '',
    appKey: '',
    appSecretKey: '',
    merchant_name: '',
    limitAmount: 1000000,
    createdby_id: agent_info._id
  });

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setactivetopbar(true)
      } else {
        setactivetopbar(false)
      }
    })
  }, []);
// Handle P2P form submission
const handleP2pSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL2}/api/general/agents`, {
      ...p2pForm,
      api_account: false
    });
    toast.success('P2P wallet added successfully!');
    setP2pForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      merchant_name: '',
      mfs: '',
      currency: '',
      accountNumber: '',
      limitAmount: 1500000,
      createdby_id: agent_info._id
    });
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add P2P wallet');
  } finally {
    setLoading(false);
  }
};

// Handle Bkash form submission
const handleBkashSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post( `${process.env.REACT_APP_BASE_URL2}/api/general/bkash-api`, {
      ...bkashForm,
      api_account: true,
      mfs: "bkash"
    });
    toast.success('Bkash API account added successfully!');
    setBkashForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      accountName: '',
      accountNumber: '',
      username: '',
      appKey: '',
      appSecretKey: '',
      merchant_name: '',
      limitAmount: 1000000,
      createdby_id: agent_info._id
    });
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add Bkash account');
  } finally {
    setLoading(false);
  }
};

// Handle Nagad form submission
const handleNagadSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL2}/api/general/nagad-api`, {
      ...nagadForm,
      api_account: true,
      mfs: "nagad"
    });
    toast.success('Nagad API account added successfully!');
    setNagadForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      accountName: '',
      accountNumber: '',
      username: '',
      appKey: '',
      appSecretKey: '',
      limitAmount: 1000000,
      merchant_name: '',
      createdby_id: agent_info._id
    });
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add Nagad account');
  } finally {
    setLoading(false);
  }
};

  return (
    <section className='w-full h-[100vh] flex font-poppins'>
      <section className={activesidebar ? 'lg:w-[7%] h-[100vh] transition-all duration-300 overflow-hidden' : 'w-0 md:w-[18%] transition-all duration-300 h-[100vh]'}>
        <Dashboardleftside />
      </section>
      <section className={activesidebar ? 'w-[100%] lg:w-[93%] h-[100vh] bg-[#EFEFFD] overflow-y-auto transition-all duration-300' : ' transition-all bg-[#EFEFFD] duration-300 w-[100%] overflow-y-auto md:w-[82%] h-[100vh]'}>
        <Dashboradheader />
        <Toaster />

        <div className="p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Wallet</h1>

          {/* Wallet Type Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Select Wallet Type</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setWalletType('p2p')}
                className={`px-6 py-3 rounded-lg border-2 ${walletType === 'p2p' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300'}`}
              >
                P2P Wallet
              </button>
              <button
                onClick={() => {
                  setWalletType('p2c');
                  setProviderType('');
                }}
                className={`px-6 py-3 rounded-lg border-2 ${walletType === 'p2c' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300'}`}
              >
                P2C Wallet
              </button>
            </div>
          </div>

          {/* Provider Selection (for P2C) */}
          {walletType === 'p2c' && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Select Provider</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => setProviderType('bkash')}
                  className={`px-6 py-3 rounded-lg border-2 ${providerType === 'bkash' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300'}`}
                >
                  Bkash
                </button>
                <button
                  onClick={() => setProviderType('nagad')}
                  className={`px-6 py-3 rounded-lg border-2 ${providerType === 'nagad' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300'}`}
                >
                  Nagad
                </button>
              </div>
            </div>
          )}

          {/* P2P Form */}
          {walletType === 'p2p' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Add P2P Wallet</h2>
              <form onSubmit={handleP2pSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={p2pForm.name}
                      onChange={(e) => setP2pForm({ ...p2pForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={p2pForm.email}
                      onChange={(e) => setP2pForm({ ...p2pForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={p2pForm.phone}
                      onChange={(e) => setP2pForm({ ...p2pForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={p2pForm.password}
                      onChange={(e) => setP2pForm({ ...p2pForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={p2pForm.merchant_name}
                      onChange={(e) => setP2pForm({ ...p2pForm, merchant_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MFS</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={p2pForm.mfs}
                      onChange={(e) => setP2pForm({ ...p2pForm, mfs: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={p2pForm.currency}
                      onChange={(e) => setP2pForm({ ...p2pForm, currency: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={p2pForm.accountNumber}
                      onChange={(e) => setP2pForm({ ...p2pForm, accountNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Limit Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={p2pForm.limitAmount}
                      onChange={(e) => setP2pForm({ ...p2pForm, limitAmount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Add P2P Wallet'}
                </button>
              </form>
            </div>
          )}

       {/* Bkash Form */}
          {walletType === 'p2c' && providerType === 'bkash' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Add Bkash API Account</h2>
              <form onSubmit={handleBkashSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.name}
                      onChange={(e) => setBkashForm({ ...bkashForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.email}
                      onChange={(e) => setBkashForm({ ...bkashForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.phone}
                      onChange={(e) => setBkashForm({ ...bkashForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.password}
                      onChange={(e) => setBkashForm({ ...bkashForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.merchant_name}
                      onChange={(e) => setBkashForm({ ...bkashForm, merchant_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.accountName}
                      onChange={(e) => setBkashForm({ ...bkashForm, accountName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.accountNumber}
                      onChange={(e) => setBkashForm({ ...bkashForm, accountNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.username}
                      onChange={(e) => setBkashForm({ ...bkashForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">App Key</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.appKey}
                      onChange={(e) => setBkashForm({ ...bkashForm, appKey: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">App Secret Key</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.appSecretKey}
                      onChange={(e) => setBkashForm({ ...bkashForm, appSecretKey: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Limit Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={bkashForm.limitAmount}
                      onChange={(e) => setBkashForm({ ...bkashForm, limitAmount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Add Bkash Account'}
                </button>
              </form>
            </div>
          )}

          {/* Nagad Form */}
          {walletType === 'p2c' && providerType === 'nagad' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Add Nagad API Account</h2>
              <form onSubmit={handleNagadSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.name}
                      onChange={(e) => setNagadForm({ ...nagadForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.email}
                      onChange={(e) => setNagadForm({ ...nagadForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.phone}
                      onChange={(e) => setNagadForm({ ...nagadForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.password}
                      onChange={(e) => setNagadForm({ ...nagadForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.merchant_name}
                      onChange={(e) => setNagadForm({ ...nagadForm, merchant_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.accountName}
                      onChange={(e) => setNagadForm({ ...nagadForm, accountName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.accountNumber}
                      onChange={(e) => setNagadForm({ ...nagadForm, accountNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.username}
                      onChange={(e) => setNagadForm({ ...nagadForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">App Key</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.appKey}
                      onChange={(e) => setNagadForm({ ...nagadForm, appKey: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">App Secret Key</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.appSecretKey}
                      onChange={(e) => setNagadForm({ ...nagadForm, appSecretKey: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Limit Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={nagadForm.limitAmount}
                      onChange={(e) => setNagadForm({ ...nagadForm, limitAmount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Add Nagad Account'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </section>
  )
}

export default Addbank;