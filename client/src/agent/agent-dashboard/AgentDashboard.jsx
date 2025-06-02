import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Contextapi } from 'context/Appcontext';
import moment from "moment";
import toast, { Toaster } from 'react-hot-toast';
import Dashboardleftside from 'components/agentcomponents/Dashboardleftside';
import Dashboradheader from 'components/agentcomponents/Dashboardheader';
import empty_image from "../../assets/empty_image.png";
import { GiOrangeSlice } from "react-icons/gi";
// Icons
import { AiOutlineSearch } from "react-icons/ai";
import { CgClose, CgMenuLeftAlt, CgMenuRightAlt } from "react-icons/cg";
import { LuPlus, LuWallet } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { BiTransfer } from "react-icons/bi";
import { SiMoneygram } from "react-icons/si";
import { MdDelete } from "react-icons/md";
import { FaBangladeshiTakaSign, FaMoneyBillTrendUp, FaMoneyCheckDollar } from "react-icons/fa6";
import { GiProfit } from "react-icons/gi";
import { FaDollarSign, FaCalendarAlt, FaFileAlt, FaThumbsUp } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";

// Chart.js imports
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { activesidebar, setactivesidebar, activetopbar, setactivetopbar } = useContext(Contextapi);
  const [showmodal, setmodal] = useState(false);
  const admin_info = JSON.parse(localStorage.getItem("admin_data"));
  const agent_info = JSON.parse(localStorage.getItem("agent_info"));
  
  // State management
  const [agent_deposit_moneyinfo, setagent_deposit_moneyinfo] = useState([]);
  const [total_amount_of_deposit, settotal_amount_of_deposit] = useState(0);
  const [total_commission, settotal_comission] = useState(0);
  const [chart_data, setchart_data] = useState([]);
  const [agent_all_info, setagent_all_info] = useState({});
  const [activetab, setactivetab] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'

  // Handlers
  const handlesidebar = () => setactivesidebar(!activesidebar);
  
  const handleRowSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = (data) => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(item => item._id));
    }
  };

  // Data fetching
  const agent_depositinfo = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-deposit/${agent_info._id}`);
      setagent_all_info(res.data.agent_information);
      
      const formattedData = res.data.data.map(transaction => ({
        timestamp: new Date(transaction.createdAt).toLocaleDateString(),
        amount: transaction.amount,
      }));
      setchart_data(formattedData);
      settotal_amount_of_deposit(res.data.total_amount_of_deposit);
      settotal_comission(res.data.total_commission);
    } catch (err) {
      console.error("Error fetching deposit info:", err);
      toast.error("Failed to load deposit information");
    }
  };

  const delete_deposit_data = async (id) => {
    const confirm_box = window.confirm("Are you sure you want to delete this record?");
    if (confirm_box) {
      try {
        await axios.delete(`${process.env.REACT_APP_BASE_URL2}/agent-deposit-history-delete/${id}`);
        agent_depositinfo();
        toast.success("Transaction record deleted successfully");
      } catch (err) {
        console.error("Error deleting deposit data:", err);
        toast.error("Failed to delete transaction record");
      }
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL2}/download-excel/${agent_info._id}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'transaction_history.xlsx';
      link.click();
      toast.success("Download started successfully");
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      toast.error("Failed to download transaction history");
    }
  };

  // Effects
  useEffect(() => {
    if (!localStorage.getItem("agent_info")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    agent_depositinfo();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setactivetopbar(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prepare monthly data for charts
  const prepareMonthlyData = () => {
    const deposits = agent_all_info.deposits || [];
    const withdrawals = agent_all_info.withdrawals || [];
    
    // Group by month
    const monthlyData = {};
    
    // Process deposits
    deposits.forEach(deposit => {
      const monthYear = moment(deposit.date).format('MMM YYYY');
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { deposits: 0, withdrawals: 0 };
      }
      monthlyData[monthYear].deposits += deposit.amount;
    });
    
    // Process withdrawals
    withdrawals.forEach(withdrawal => {
      const monthYear = moment(withdrawal.date).format('MMM YYYY');
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { deposits: 0, withdrawals: 0 };
      }
      monthlyData[monthYear].withdrawals += withdrawal.amount;
    });
    
    // Sort by date
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => 
      moment(a, 'MMM YYYY').valueOf() - moment(b, 'MMM YYYY').valueOf()
    );
    
    return {
      labels: sortedMonths,
      depositData: sortedMonths.map(month => monthlyData[month].deposits),
      withdrawalData: sortedMonths.map(month => monthlyData[month].withdrawals)
    };
  };

  const monthlyData = prepareMonthlyData();

  // Chart data configuration
  const chartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Deposits',
        data: monthlyData.depositData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Withdrawals',
        data: monthlyData.withdrawalData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ৳${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '৳' + value.toLocaleString();
          }
        }
      }
    }
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: '🔄' },
      completed: { color: 'bg-green-100 text-green-800', icon: '✔️' },
      failed: { color: 'bg-red-100 text-red-800', icon: '❌' },
      processing: { color: 'bg-blue-100 text-blue-800', icon: '⏳' },
      'fully paid': { color: 'bg-green-100 text-green-800', icon: '✔️' },
      default: { color: 'bg-gray-100 text-gray-800', icon: '❓' }
    };
    
    const { color, icon } = statusConfig[status.toLowerCase()] || statusConfig.default;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon} {status}
      </span>
    );
  };

  // Empty State Component
  const EmptyState = ({ type }) => (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <div className="mx-auto w-24 h-24 text-gray-400">
        {type === 'withdrawal' ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        No {type} history found
      </h3>
      <p className="mt-1 text-gray-500">
        Your {type} transactions will appear here once processed
      </p>
    </div>
  );

  // Dashboard Metrics Cards
  const MetricCard = ({ title, value, icon, color, footerText, footerIcon }) => (
    <div className={`bg-white rounded-lg overflow-hidden border border-gray-200 ${color.border}`}>
      <div className="px-5 pt-6 pb-3 flex justify-between items-start">
        <div>
          <h1 className={`text-2xl font-bold ${color.text}`}>
            {value || 0}
          </h1>
          <p className="text-gray-600 text-sm mt-1">{title}</p>
        </div>
        <div className={`p-3 rounded-full ${color.bg} bg-opacity-20`}>
          {React.cloneElement(icon, { className: `text-xl ${color.text}` })}
        </div>
      </div>
      <div className={`${color.bg} text-white px-5 py-2 flex justify-between items-center text-xs font-medium`}>
        <span>{footerText}</span>
        <span>{footerIcon}</span>
      </div>
    </div>
  );

  return (
    <section className="w-full h-[100vh] flex font-poppins ">
      {/* Sidebar */}
      <aside className={activesidebar 
        ? 'lg:w-[18%] h-[100vh] transition-all duration-300 overflow-hidden' 
        : 'w-0 md:w-[18%] transition-all duration-300 h-[100vh]'}>
        <Dashboardleftside />
      </aside>

      {/* Main Content */}
      <main className={activesidebar 
        ? 'w-[100%] lg:w-[82%] h-[100vh] overflow-y-auto transition-all duration-300' 
        : 'transition-all duration-300 w-[100%] overflow-y-auto md:w-[82%] h-[100vh]'}>
        
        <Dashboradheader total_amount={total_amount_of_deposit} />
        <Toaster position="top-right" reverseOrder={false} />
        
        <section className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Comprehensive analytics of your financial activities</p>
          </header>

          {/* Metrics Grid */}
     {/* Metrics Grid */}
<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <MetricCard
    title="Deposit Balance"
    value={agent_all_info.balance_in_bdt}
    icon={<FaBangladeshiTakaSign />}
    color={{
      text: 'text-amber-600',
      bg: 'bg-amber-600',
      border: 'border-amber-100'
    }}
    footerText="USDT Equivalent"
    footerIcon={`$${agent_all_info?.balanceAmount || 0}`}
  />
{/* 
  <MetricCard
    title="Account Limit"
    value={agent_all_info.limitAmount > 0 ? agent_all_info.limitAmount : 0}
    icon={<GiOrangeSlice />}
    color={{
      text: 'text-red-600',
      bg: 'bg-red-600',
      border: 'border-red-100'
    }}
    footerText="Can be increased"
    footerIcon="📉"
  />

  <MetricCard
    title="Remaining Limit"
    value={agent_all_info.limitRemaining > 0 ? agent_all_info.limitRemaining : 0}
    icon={<LuWallet />}
    color={{
      text: 'text-green-600',
      bg: 'bg-green-600',
      border: 'border-green-100'
    }}
    footerText="Deposit needed"
    footerIcon="📈"
  /> */}

  <MetricCard
    title="Total Commission"
    value={agent_all_info.commission || 0}
    icon={<GiProfit />}
    color={{
      text: 'text-blue-600',
      bg: 'bg-blue-600',
      border: 'border-blue-100'
    }}
    footerText="Available for withdrawal"
    footerIcon="💰"
  />

  {/* New Metric Card 1 - Already Added Balance */}
  <MetricCard
    title="Already Added Balance"
    value={agent_all_info.deposited_balance || 0}
    icon={<FaMoneyBillTrendUp />}
    color={{
      text: 'text-purple-600',
      bg: 'bg-purple-600',
      border: 'border-purple-100'
    }}
    footerText="Total deposited"
    footerIcon="💳"
  />

  {/* New Metric Card 2 - Available for Deposit */}
  <MetricCard
    title="Available for Deposit"
    value={agent_all_info.remain_balance || 0}
    icon={<FaMoneyCheckDollar />}
    color={{
      text: 'text-teal-600',
      bg: 'bg-teal-600',
      border: 'border-teal-100'
    }}
    footerText="Ready to use"
    footerIcon="🔄"
  />
</section>

          {/* Transaction History Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
                  <p className="text-gray-600 mt-1">
                    Detailed records of your financial transactions (retained for 30 days)
                  </p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-8">
                <button
                  onClick={() => setactivetab(1)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activetab === 1 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Withdrawals
                  {agent_all_info.withdrawals?.length > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {agent_all_info.withdrawals?.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setactivetab(2)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activetab === 2 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Deposits
                  {agent_all_info.deposits?.length > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {agent_all_info.deposits?.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div>
                {/* Withdrawals Tab */}
                <div className={activetab === 1 ? "block" : "hidden"}>
                  {agent_all_info.withdrawals?.length > 0 ? (
                    <div className="overflow-x-auto border-[1px] border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <input
                                type="checkbox"
                                checked={selectedRows.length === agent_all_info.withdrawals?.length && agent_all_info.withdrawals?.length > 0}
                                onChange={() => handleSelectAll(agent_all_info.withdrawals || [])}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Transaction ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Method
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {agent_all_info.withdrawals?.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedRows.includes(transaction._id)}
                                  onChange={() => handleRowSelect(transaction._id)}
                                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {transaction.transactionId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {moment(transaction.date).format("DD MMM YYYY, h:mm A")}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 capitalize">{transaction.method}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={transaction.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                ৳{transaction.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState type="withdrawal" />
                  )}
                </div>

                {/* Deposits Tab */}
                <div className={activetab === 2 ? "block" : "hidden"}>
                  {agent_all_info.deposits?.length > 0 ? (
                    <div className="overflow-x-auto border-[1px] border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <input
                                type="checkbox"
                                checked={selectedRows.length === agent_all_info.deposits?.length && agent_all_info.deposits?.length > 0}
                                onChange={() => handleSelectAll(agent_all_info.deposits || [])}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Transaction ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Method
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {agent_all_info.deposits?.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedRows.includes(transaction._id)}
                                  onChange={() => handleRowSelect(transaction._id)}
                                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {transaction.transactionId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {moment(transaction.date).format("DD MMM YYYY, h:mm A")}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 capitalize">{transaction.method}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{transaction.notes}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                ৳{transaction.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={transaction.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState type="deposit" />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Monthly Transaction Charts Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Monthly Transaction Summary</h2>
                  <p className="text-gray-600 mt-1">
                    Visual representation of your deposits and withdrawals by month
                  </p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${chartType === 'bar' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Bar Chart
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${chartType === 'line' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Line Chart
                  </button>
                </div>
              </div>

              {monthlyData.labels.length > 0 ? (
                <div className="h-80">
                  {chartType === 'bar' ? (
                    <Bar data={chartData} options={options} />
                  ) : (
                    <Line data={chartData} options={options} />
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="mx-auto w-24 h-24 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No transaction data available
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Your monthly transaction charts will appear here once you have transactions
                  </p>
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </section>
  );
};

export default AgentDashboard;