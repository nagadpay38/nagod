import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Contextapi } from "context/Appcontext";
import Dashboardleftside from "components/agentcomponents/Dashboardleftside";
import Dashboradheader from "components/agentcomponents/Dashboardheader";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
import axios from "axios";

const Agentprofile = () => {
  const navigate = useNavigate();
  const agent_info = JSON.parse(localStorage.getItem("agent_info"));
  const { activesidebar, setactivesidebar, activetopbar, setactivetopbar } =
    useContext(Contextapi);
  const [agentData, setAgentData] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [agentAllInfo, setAgentAllInfo] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdraw_info,set_withdrawinfo]=useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL2}/agent-deposit/${agent_info._id}`)
      .then((res) => {
        setAgentAllInfo(res.data.agent_information);
      })
      .catch((err) => console.log(err));

    axios
      .get(`${process.env.REACT_APP_BASE_URL2}/single-agent-data/${agent_info?._id}`)
      .then((res) => {
        setTransactions(res.data.agent_deposit_data);
        console.log(res.data.agent_deposit_data)
      })
      .catch((err) => console.log(err));
      axios
      .get(`${process.env.REACT_APP_BASE_URL2}/single-agent-withdraw/${agent_info?._id}`)
      .then((res) => {
        set_withdrawinfo(res.data.data);
        console.log(res.data.data)
      })
      .catch((err) => console.log(err));
  }, []);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-information/${agent_info._id}`)
      .then((res) => {
        if (res.data.success) {
          setAgentData(res.data.data);
          setFormData({
            phone: res.data.data.accountNumber,
            email: res.data.data.email,
            password: res.data.data.password,
          });
        } else {
          toast.error('Failed to load agent info');
        }
      })
      .catch(() => toast.error('Error fetching data'));
  }, []);
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Email and password are required');
    }
    axios.put(`${process.env.REACT_APP_BASE_URL2}/agent-update/${agent_info._id}`, formData)
      .then((res) => toast.success(res.data.message))
      .catch(() => toast.error('Update failed'));
  };

  return (
    <section className="w-full h-screen flex font-poppins">
      {/* Sidebar */}
      <section className={activesidebar ? "lg:w-[7%] transition-all duration-300" : "w-0 md:w-[18%] transition-all duration-300"}>
        <Dashboardleftside />
      </section>

      {/* Main Content */}
      <section className={activesidebar ? "w-[100%] lg:w-[93%] transition-all duration-300 bg-[#EFEFFD] overflow-y-auto" : "w-[100%] md:w-[82%] bg-[#EFEFFD] overflow-y-auto"}>
        <Dashboradheader />
        <Toaster />

        <div className="w-full py-5 px-4 lg:px-8">
          {/* Tab Buttons */}
        <div className="flex justify-between items-center">
        <div className="flex gap-4 mb-5 border-b pb-2">
            <button onClick={() => setActiveTab("profile")} className={`px-5 py-2 rounded-md ${activeTab === "profile" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}>
              Profile
            </button>
            <button onClick={() => setActiveTab("transactions")} className={`px-5 py-2 rounded-md ${activeTab === "transactions" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}>
             Deposit Transactions
            </button>
            <button onClick={() => setActiveTab("withdraw")} className={`px-5 py-2 rounded-md ${activeTab === "withdraw" ? "bg-indigo-500 text-white" : "bg-gray-200"}`}>
             Withdraw Transactions
            </button>
          </div>
          <NavLink to="/agent-withdraw">
            <button className="px-[20px] py-[12px] bg-indigo-500 text-white rounded-[5px] text-[16px]">Withdraw</button>
          </NavLink>
        </div>

          {/* Profile Section */}
          {activeTab === "profile" && (
            <section className="bg-white rounded-md p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="border-2 border-gray-300 p-2 rounded-md">
                  <img className="w-32 h-32 md:w-40 md:h-40 rounded-md" src={`https://robohash.org/${agentAllInfo?.name}.png`} alt="Agent" />
                </div>
                
                {/* Profile Info */}
                <div>
                  <h2 className="text-xl font-semibold">{agentAllInfo.name}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    ৳
                    <span>{agentAllInfo.email}</span>
                  </div>

                  {/* Balance Card */}
                  <div className="mt-5 flex gap-4">
                    <div className="flex items-center gap-3 border border-gray-300 p-3 rounded-md">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 flex justify-center items-center rounded-full">
                      ৳
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">৳ {agentAllInfo.balance_in_bdt}</h3>
                        <p className="text-gray-500">Deposit Amount</p>
                      </div>
                    </div>
         
                  </div>
                  
                </div>
              </div>
              <form onSubmit={handleUpdate} className='mt-4'>
                  <input type='email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className='w-full p-2 border  border-gray-200 rounded mt-2' />
                  <input type='password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className='w-full p-2 border border-gray-200 rounded mt-2' />
                  <button type='submit' className='bg-indigo-500 text-white text-[14px] lg:text-[16px] px-4 py-1  mt-3 rounded'>Update</button>
                </form>
            </section>
          )}

          {/* Transaction Section */}
          {activeTab === "transactions" && (
            <section className="bg-white  rounded-md px-2 py-6">
              <h2 className="text-lg font-semibold mb-4">Transaction History</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border">Invoice</th>
                      <th className="p-3 border">Provider</th>
                      <th className="p-3 border">Amount</th>
                      <th className="p-3 border">Status</th>
                      <th className="p-3 border">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      
                    }
                    {transactions.length > 0 ? (
                      transactions.map((txn) => (
                        <tr key={txn._id} className="text-gray-700">
                          <td className="p-3 border">{txn.invoice_id}</td>
                          <td className="p-3 border">{txn.provider_name}</td>
                          <td className="p-3 border">$ {txn.amount}</td>
                          <td
  className={`p-3 border ${
    txn.status === "completed"
      ? "text-green-500"
      : txn.status === "fully paid"
      ? "text-blue-500"
      : txn.status === "pending"
      ? "text-yellow-500"
      : txn.status === "hold"
      ? "text-orange-500"
      : txn.status === "cancel"
      ? "text-red-500"
      : txn.status === "suspended"
      ? "text-gray-500"
      : "text-black"
  }`}
>
  {txn.status}
</td>

                          <td className="p-3 border">{new Date(txn.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-3 border text-center text-gray-500">
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
            {/* Transaction Section */}
            {activeTab === "withdraw" && (
            <section className="bg-white  rounded-md px-2 py-6">
              <h2 className="text-lg font-semibold mb-4">Withdraw History</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border">Invoice</th>
                      <th className="p-3 border">Method</th>
                      <th className="p-3 border">Amount</th>
                      <th className="p-3 border">Status</th>
                      <th className="p-3 border">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      
                    }
                    {withdraw_info.length > 0 ? (
                      withdraw_info.map((txn) => (
                        <tr key={txn._id} className="text-gray-700">
                          <td className="p-3 border">#{txn.invoiceId}</td>
                          <td className="p-3 border">Binance</td>
                          <td className="p-3 border">৳{txn.amount}</td>
                          <td
  className={`p-3 border ${
    txn.status === "approved"
      ? "text-green-500"
      : txn.status === "fully paid"
      ? "text-blue-500"
      : txn.status === "pending"
      ? "text-yellow-500"
      : txn.status === "hold"
      ? "text-orange-500"
      : txn.status === "rejected"
      ? "text-red-500"
      : txn.status === "suspended"
      ? "text-gray-500"
      : "text-black"
  }`}
>
  {txn.status}
</td>

                          <td className="p-3 border">{new Date(txn.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-3 border text-center text-gray-500">
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </section>
    </section>
  );
};

export default Agentprofile;
