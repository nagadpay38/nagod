import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Contextapi } from 'context/Appcontext';
import Dashboardleftside from 'components/agentcomponents/Dashboardleftside';
import Dashboradheader from 'components/agentcomponents/Dashboardheader';
import Swal from 'sweetalert2';
import { 
  ResponsiveContainer, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area, 
  PieChart, 
  Pie, 
  Legend,
  Cell
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FiSearch, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight,
  FiAlertCircle,
  FiUsers,
  FiDollarSign,
  FiPlus,
  FiMinus
} from 'react-icons/fi';

const Bankaccount = () => {
  const navigate = useNavigate();
  const { activesidebar, setactivesidebar, activetopbar, setactivetopbar } = useContext(Contextapi);
  const [showmodal, setmodal] = useState(false);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const agent_info = JSON.parse(localStorage.getItem("agent_info"));
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mfsFilter, setMfsFilter] = useState('all');
  
  // Stats state
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    inactiveAgents: 0,
    totalBalance: 0
  });

  // Status toggle state
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [commissionRate, setCommissionRate] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);

  // Balance edit state
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceAction, setBalanceAction] = useState('add'); // 'add' or 'subtract'
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);

  // Commission Modal Component
// Commission Modal Component with withdraw commission rate
const CommissionModal = ({ agent, onClose, onConfirm }) => {
    const [rate, setRate] = useState(agent?.commission_rate || '');
    const [withdrawRate, setWithdrawRate] = useState(agent?.withdraw_commission_rate || '');

    const handleConfirm = () => {
        if (!rate || isNaN(rate) || !withdrawRate || isNaN(withdrawRate)) {
            toast.error('Please enter valid commission rates');
            return;
        }
        onConfirm(rate, withdrawRate);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Set Commission Rates for {agent?.name}
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deposit Commission Rate (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter deposit commission rate"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Withdrawal Commission Rate (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={withdrawRate}
                            onChange={(e) => setWithdrawRate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter withdrawal commission rate"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
  // Balance Edit Modal Component
  const BalanceModal = ({ agent, onClose }) => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!balanceAmount || isNaN(balanceAmount)) {
        toast.error('Please enter a valid amount');
        return;
      }

      try {
        setIsUpdatingBalance(true);
        const amount = balanceAction === 'add' ? 
          parseFloat(balanceAmount) : 
          -Math.abs(parseFloat(balanceAmount));

        const response = await axios.patch(
          `${process.env.REACT_APP_BASE_URL2}/agents/${agent._id}/balance`,
          { 
            amount: amount,
            main_agent: agent_info._id
          }
        );

        if (response.data) {
          toast.success(`Balance ${balanceAction === 'add' ? 'added' : 'subtracted'} successfully`);
          await fetchAgents();
          onClose();
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to update balance');
      } finally {
        setIsUpdatingBalance(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {balanceAction === 'add' ? 'Add to' : 'Subtract from'} {agent?.name}'s Balance
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (BDT)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 
৳
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    value={balanceAction}
                    onChange={(e) => setBalanceAction(e.target.value)}
                    className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-lg"
                  >
                    <option value="add">Add</option>
                    <option value="subtract">Subtract</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingBalance}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingBalance ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  balanceAction === 'add' ? 'Add Funds' : 'Subtract Funds'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL2}/api/general/all-agent/${agent_info._id}`);
      setAgents(response.data.data);
      calculateStats(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast.error('Failed to fetch agent data');
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setactivetopbar(true)
      } else {
        setactivetopbar(false)
      }
    });
    
    fetchAgents();
  }, []);

  const calculateStats = (agentsData) => {
    const total = agentsData.length;
    const active = agentsData.filter(agent => agent.status === 'activated').length;
    const inactive = agentsData.filter(agent => agent.status === 'deactivated').length;
    const balance = agentsData.reduce((sum, agent) => sum + (agent.balance_in_bdt || 0), 0);
    
    setStats({
      totalAgents: total,
      activeAgents: active,
      inactiveAgents: inactive,
      totalBalance: balance
    });
  };

  const handleDeleteAgent = async (agentId, nidOrPassport) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `${process.env.REACT_APP_BASE_URL2}/agent-delete/${agentId}`
        );

        if (response.data.success) {
          await Swal.fire(
            'Deleted!',
            'Agent has been deleted.',
            'success'
          );
          fetchAgents(); // Refresh the agent list
        } else {
          throw new Error('Failed to delete agent');
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error!',
        'Failed to delete agent.',
        'error'
      );
    }
  };

  const handleStatusToggle = async (agent) => {
    const newStatus = agent.status === 'activated' ? 'deactivated' : 'activated';
    
    // If activating, show commission modal first
    if (newStatus === 'activated') {
      setSelectedAgent(agent);
      setShowCommissionModal(true);
      return;
    }
    
    // If deactivating, proceed directly
    try {
      setIsUpdating(true);
      setSelectedAgent(agent); // Set the agent being updated for loading state
      
      await axios.put(`${process.env.REACT_APP_BASE_URL2}/agent-update/${agent._id}`, {
        admin_name: agent_info.name,
        status: newStatus
      });
      
      await fetchAgents();
      toast.success(`Agent deactivated successfully`);
    } catch (error) {
      toast.error('Failed to update agent status');
      console.error(error);
    } finally {
      setIsUpdating(false);
      setSelectedAgent(null);
    }
  };
const handleConfirmCommission = async (depositRate, withdrawRate) => {
    if (!depositRate || isNaN(depositRate) || !withdrawRate || isNaN(withdrawRate)) {
        toast.error('Please enter valid commission rates');
        return;
    }

    try {
        setIsUpdating(true);
        await axios.put(`${process.env.REACT_APP_BASE_URL2}/agent-update/${selectedAgent._id}`, {
            admin_name: agent_info.name,
            status: 'activated',
                  commission_rate: Number(depositRate),
            withdraw_commission_rate: Number(withdrawRate)
        });
        await fetchAgents();
        toast.success('Agent activated successfully');
    } catch (error) {
        toast.error('Failed to update agent status');
        console.error(error);
    } finally {
        setIsUpdating(false);
        setShowCommissionModal(false);
        setSelectedAgent(null);
    }
};

  const handleEditBalance = (agent) => {
    setSelectedAgent(agent);
    setBalanceAmount('');
    setBalanceAction('add');
    setShowBalanceModal(true);
  };

  const filteredAgents = agents.filter(agent => {
    const name = agent.name || '';
    const email = agent.email || '';
    const accountNumber = agent.accountNumber || '';
    
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    const matchesMfs = mfsFilter === 'all' || agent.mfs === mfsFilter;
    
    return matchesSearch && matchesStatus && matchesMfs;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'deactivated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMfsBadge = (mfs) => {
    switch (mfs) {
      case 'nagad':
        return 'bg-purple-100 text-purple-800';
      case 'bkash':
        return 'bg-blue-100 text-blue-800';
      case 'rocket':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className='w-full h-[100vh] flex font-poppins'>
      <section className={activesidebar ? 'lg:w-[7%] h-[100vh] transition-all duration-300 overflow-hidden' : 'w-0 md:w-[18%] transition-all duration-300 h-[100vh]'}>
        <Dashboardleftside />
      </section>
      <section className={activesidebar ? 'w-[100%] lg:w-[93%] h-[100vh] bg-[#EFEFFD] overflow-y-auto transition-all duration-300' : 'transition-all bg-[#EFEFFD] duration-300 w-[100%] overflow-y-auto md:w-[82%] h-[100vh]'}>
        <Dashboradheader />
        <Toaster />

       {showCommissionModal && selectedAgent && (
    <CommissionModal
        agent={selectedAgent}
        onClose={() => {
            setShowCommissionModal(false);
            setSelectedAgent(null);
        }}
        onConfirm={(depositRate, withdrawRate) => handleConfirmCommission(depositRate, withdrawRate)}
    />
)}
        {showBalanceModal && selectedAgent && (
          <BalanceModal
            agent={selectedAgent}
            onClose={() => {
              setShowBalanceModal(false);
              setSelectedAgent(null);
            }}
          />
        )}

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Total Agents</h3>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalAgents}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Active Agents</h3>
              <p className="text-2xl font-semibold text-green-600">{stats.activeAgents}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Inactive Agents</h3>
              <p className="text-2xl font-semibold text-amber-500">{stats.inactiveAgents}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Total Balance</h3>
              <p className="text-2xl font-semibold text-blue-600">৳{stats.totalBalance.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  placeholder="Search by name, email or account"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center">
                  <label htmlFor="status-filter" className="mr-2 text-sm text-gray-600 whitespace-nowrap">Status:</label>
                  <select
                    id="status-filter"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="deactivated">Deactivated</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label htmlFor="mfs-filter" className="mr-2 text-sm text-gray-600 whitespace-nowrap">MFS:</label>
                  <select
                    id="mfs-filter"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={mfsFilter}
                    onChange={(e) => {
                      setMfsFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="nagad">Nagad</option>
                    <option value="bkash">bKash</option>
                    <option value="rocket">Rocket</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-6 text-center">
                <div className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Loading agent data...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 text-red-600">
                  <FiAlertCircle className="mr-2" />
                  <span>Error: {error}</span>
                  <button 
                    onClick={fetchAgents}
                    className="ml-3 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agent
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MFS
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Commission
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentAgents.length > 0 ? (
                        currentAgents.map((agent) => (
                          <tr key={agent?._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                                  <span className="text-white font-medium text-sm">
                                    {agent.name?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{agent?.name}</div>
                                  <div className="text-sm text-gray-500">{agent?.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-mono">{agent?.accountNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <button
                                  disabled={isUpdating && selectedAgent?._id === agent._id}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    agent.status === 'activated' ? 'bg-green-500' : 'bg-gray-200'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      agent.status === 'activated' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                                <span className={`ml-2 text-xs font-medium ${
                                  agent.status === 'activated' ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                  {isUpdating && selectedAgent?._id === agent._id ? 'Updating...' : 
                                   agent.status === 'activated' ? 'Activated' : 'Deactivated'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${getMfsBadge(agent.mfs)}`}>
                                {agent.mfs?.charAt(0).toUpperCase() + agent.mfs?.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-[16px] font-[500] text-gray-500 mr-2">
                                  ৳{agent?.balance_in_bdt?.toLocaleString()}
                                </span>
                                <button 
                                  onClick={() => handleEditBalance(agent)}
                                  className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                                  title="Edit balance"
                                >
                                  <FiEdit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <p>৳{agent.commission}</p>
                              {/* <p>withdraw rate :{agent.withdraw_commission_rate}%</p>
                              <p>depsoit rate :{agent.commission_rate}%</p> */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(agent.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button 
                                onClick={() => handleDeleteAgent(agent._id, agent.nid_or_passport)}
                                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <FiUsers className="h-10 w-10 mb-2" />
                              <p className="text-sm">No agents found matching your criteria</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredAgents.length > itemsPerPage && (
                  <div className="bg-white px-5 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                          <span className="font-medium">
                            {indexOfLastItem > filteredAgents.length ? filteredAgents.length : indexOfLastItem}
                          </span>{' '}
                          of <span className="font-medium">{filteredAgents.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Previous</span>
                            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                              key={number}
                              onClick={() => paginate(number)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === number
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {number}
                            </button>
                          ))}
                          <button
                            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Next</span>
                            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Balance Overview</h3>
                <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>Last 2 Years</option>
                </select>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: 'Jan', balance: 4000 },
                      { name: 'Feb', balance: 3000 },
                      { name: 'Mar', balance: 5000 },
                      { name: 'Apr', balance: 2780 },
                      { name: 'May', balance: 1890 },
                      { name: 'Jun', balance: 2390 },
                    ]}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#4f46e5" 
                      fillOpacity={1} 
                      fill="url(#colorBalance)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Active', value: stats.activeAgents, color: '#10b981' },
                        { name: 'Inactive', value: stats.inactiveAgents, color: '#f59e0b' },
                        { name: 'Deactivated', value: stats.totalAgents - stats.activeAgents - stats.inactiveAgents, color: '#ef4444' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {[
                        { name: 'Active', value: stats.activeAgents, color: '#10b981' },
                        { name: 'Inactive', value: stats.inactiveAgents, color: '#f59e0b' },
                        { name: 'Deactivated', value: stats.totalAgents - stats.activeAgents - stats.inactiveAgents, color: '#ef4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{
                        paddingLeft: '20px'
                      }}
                      formatter={(value, entry, index) => {
                        const color = [
                          '#10b981',
                          '#f59e0b',
                          '#ef4444'
                        ][index];
                        return (
                          <span style={{ color: '#6b7280', fontSize: '12px' }}>
                            <span style={{ 
                              display: 'inline-block', 
                              width: '10px', 
                              height: '10px', 
                              backgroundColor: color, 
                              borderRadius: '50%',
                              marginRight: '8px'
                            }}></span>
                            {value}
                          </span>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

export default Bankaccount