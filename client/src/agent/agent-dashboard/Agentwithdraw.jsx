import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import { LuPlus } from "react-icons/lu";
import { NavLink, useNavigate } from 'react-router-dom';
 import { IoClose } from "react-icons/io5";
import { CgMenuLeftAlt } from "react-icons/cg";
import axios from 'axios'
import { FaWallet } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { BiTransfer } from "react-icons/bi";
import { CgMenuRightAlt } from "react-icons/cg";
import { SiMoneygram } from "react-icons/si";
import { MdDelete } from "react-icons/md";
import revenueData from 'data/revenueData';
import { Contextapi } from 'context/Appcontext';
import moment from "moment"
import { FaBangladeshiTakaSign } from "react-icons/fa6"
import { FcMoneyTransfer } from "react-icons/fc";
import Dashboardleftside from 'components/agentcomponents/Dashboardleftside';
import Dashboradheader from 'components/agentcomponents/Dashboardheader';
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import empty_image from "../../assets/empty_image.png"
import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,Legend,BarChart,Bar,ResponsiveContainer,PieChart,Pie} from "recharts"
import toast, { Toaster } from 'react-hot-toast';
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { GiProfit } from "react-icons/gi";
const Agentwithdraw = () => {

   const navigate=useNavigate();
     const {activesidebar,setactivesidebar,activetopbar,setactivetopbar}=useContext(Contextapi);
     const [showmodal,setmodal]=useState(false);
       const admin_info=JSON.parse(localStorage.getItem("admin_data"));
      console.log(admin_info)
 
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
    // -------------agent information
    const agent_info=JSON.parse(localStorage.getItem("agent_info"));
    const [agent_deposit_moneyinfo,setagent_deposit_moneyinfo]=useState([]);
   const [total_amount_of_deposit,settotal_amount_of_deposit]=useState();
   const [total_commission,settotal_comission]=useState();
   const [chart_data,setchart_data]=useState([]);
   const [agent_all_info,setagent_all_info]=useState([]);
   const [agent_withdraw_info,set_agent_withdraw_info]=useState([]);
     async function agent_depositinfo(){
        axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-deposit/${agent_info._id}`)
        .then((res)=>{
          setagent_deposit_moneyinfo(res.data.data);
          setagent_all_info(res.data.agent_information);
          set_agent_withdraw_info(res.data.find_agent_withdraw);
          console.log(res.data.find_agent_withdraw)
          const formattedData = res.data.data.map((transaction) => ({
                    timestamp: new Date(transaction.createdAt).toLocaleDateString(), // Format timestamp
                    amount: transaction.amount,
                }));
                setchart_data(formattedData)
          settotal_amount_of_deposit(res.data.total_amount_of_deposit);
          settotal_comission(res.data.total_commission);
        }).catch((err)=>{
          console.log(err)
        })
       }
    useEffect(()=>{
       agent_depositinfo();
    },[]);
// ---------------withdraw-system----------
const [amount, setAmount] = useState("");
const [walletAddress, setWalletAddress] = useState("");
const [loading, setLoading] = useState(false);
const handleWithdraw = (e) => {
  e.preventDefault();

  if (!walletAddress || walletAddress.length < 10) {
    return toast.error("Invalid wallet address");
  }
  if (!amount || amount <= 0) {
    return toast.error("Enter a valid amount");
  }
  if(agent_all_info.commission < amount){
    return toast.error("You do not have sufficient Balance!");
  }

  setLoading(true);
  axios.post(`${process.env.REACT_APP_BASE_URL2}/create-agent-withdraw`, { walletAddress, amount,agent_id:agent_info._id})
    .then((response) => {
        if(response.data.success){
            toast.success("Withdrawal request submitted successfully");
            setTimeout(()=>{
              navigate("/agent-dashboard")
            },1000)
        }else{
             toast.error(response.data.message);
        }
   
    })
    .catch((error) => {
      toast.error("Failed to submit withdrawal request");
    })
    .finally(() => {
      setLoading(false);
    });
};
  return (
    <section className='w-full h-[100vh] flex font-poppins'>
        <section className={activesidebar ? 'lg:w-[7%] h-[100vh] transition-all duration-300 overflow-hidden':'w-0 md:w-[18%] transition-all duration-300 h-[100vh]'}>
            <Dashboardleftside/>
        </section>
        <section className={activesidebar ? 'w-[100%] lg:w-[93%] h-[100vh] bg-[#EFEFFD] overflow-y-auto transition-all duration-300':' transition-all bg-[#EFEFFD] duration-300 w-[100%] overflow-y-auto md:w-[82%] h-[100vh]'}>
        <Dashboradheader total_amount={total_amount_of_deposit}/> 
        <div className=" flex items-center justify-center bg-gray-100 p-4">
      <Toaster position="top-right" />
      <div className="bg-white  rounded-[5px] p-6 w-full border border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <img
            src="https://origin-r2.ibbf55-resources.com/ContentCommon/payments/icons/new/ib_NEW_binance_pay_1.svg"
            alt="Binance Pay"
            className="w-20 h-20"
          />
        </div>
        <h2 className="text-[20px] lg:text-2xl font-semibold text-center text-gray-800 mb-4">
          Binance Withdraw
        </h2>
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-[15px] lg:text-[17px] font-medium text-gray-600">
              Wallet Address
            </label>
            <input
              type="text"
              placeholder="Enter Binance wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-[5px] mt-1 focus:ring-2 border-gray-300 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-[15px] lg:text-[17px] font-medium text-gray-600">
              Amount (BDT)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-[5px] mt-1 focus:ring-2 border-gray-300 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FaWallet /> {loading ? "Processing..." : "Withdraw"}
          </button>
        </form>
      </div>
    </div>
        </section>
    </section>
  )
}

export default Agentwithdraw