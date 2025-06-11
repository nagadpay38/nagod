import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { Contextapi } from 'context/Appcontext';
import moment from "moment"
import Dashboardleftside from 'components/agentcomponents/Dashboardleftside';
import Dashboradheader from 'components/agentcomponents/Dashboardheader';
import empty_image from "../../assets/empty_image.png"
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
const Depositandtopup = () => {
  const navigate = useNavigate();
  const { activesidebar, setactivesidebar, activetopbar, setactivetopbar } = useContext(Contextapi);
  const [activetab, setactivetab] = useState(1); // Default to withdraw tab
  
  // Agent data
  const agent_info = JSON.parse(localStorage.getItem("agent_info"));
  const [withdrawData, setWithdrawData] = useState([]);
  const [depositData, setDepositData] = useState([]);
  const [loading, setLoading] = useState({ withdraw: true, deposit: true });
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0
  });

  // Fetch withdrawal data
  const fetchWithdrawData = async () => {
    try {
      setLoading(prev => ({ ...prev, withdraw: true }));
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL2}/single-agent-withdraw/${agent_info._id}`);
      setWithdrawData(response.data.data);
      
      // Calculate stats
      const total = response.data.data.reduce((sum, item) => sum + item.amount, 0);
      const pending = response.data.data.filter(item => item.status === 'pending').length;
      setStats(prev => ({ ...prev, totalWithdrawals: total, pendingWithdrawals: pending }));
    } catch (error) {
      console.error("Error fetching withdrawal data:", error);
      toast.error("Failed to load withdrawal data");
    } finally {
      setLoading(prev => ({ ...prev, withdraw: false }));
    }
  };

  // Fetch deposit data
  const fetchDepositData = async () => {
    try {
      setLoading(prev => ({ ...prev, deposit: true }));
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL2}/single-agent-data/${agent_info._id}`);
      setDepositData(response.data.agent_deposit_data);
      
      // Calculate total deposits
      const total = response.data.agent_deposit_data.reduce((sum, item) => sum + item.amount, 0);
      setStats(prev => ({ ...prev, totalDeposits: total }));
    } catch (error) {
      console.error("Error fetching deposit data:", error);
      toast.error("Failed to load deposit data");
    } finally {
      setLoading(prev => ({ ...prev, deposit: false }));
    }
  };

  // Delete record
const deleteRecord = async (id, type) => {
  const result = await Swal.fire({
    title: `Delete ${type} record?`,
    text: `You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      const endpoint = type === 'withdraw' 
        ? `${process.env.REACT_APP_BASE_URL2}/withdraw-delete/${id}`
        : `${process.env.REACT_APP_BASE_URL2}/agent-deposit-history-delete/${id}`;
      
      await axios.delete(endpoint);
      
      await Swal.fire(
        'Deleted!',
        `${type.charAt(0).toUpperCase() + type.slice(1)} record has been deleted.`,
        'success'
      );
      
      // Refresh data
      if (type === 'withdraw') {
        fetchWithdrawData();
      } else {
        fetchDepositData();
      }
    } catch (error) {
      console.error(`Error deleting ${type} record:`, error);
      await Swal.fire(
        'Error!',
        `Failed to delete ${type} record.`,
        'error'
      );
    }
  }
};
  useEffect(() => {
    fetchWithdrawData();
    fetchDepositData();
    
    // Scroll event listener
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setactivetopbar(true);
      } else {
        setactivetopbar(false);
      }
    });
    
    return () => window.removeEventListener("scroll", () => {});
  }, []);

  return (
    <section className='w-full h-[100vh] flex font-poppins'>
      {/* Sidebar */}
      <section className={activesidebar ? 'lg:w-[7%] h-[100vh] transition-all duration-300 overflow-hidden' : 'w-0 md:w-[18%] transition-all duration-300 h-[100vh]'}>
        <Dashboardleftside />
      </section>

      {/* Main Content */}
      <section className={activesidebar ? 'w-[100%] lg:w-[93%] h-[100vh] bg-[#EFEFFD] overflow-y-auto transition-all duration-300' : 'transition-all bg-[#EFEFFD] duration-300 w-[100%] overflow-y-auto md:w-[82%] h-[100vh]'}>
        <Dashboradheader />
        <Toaster />
        
        <section className='w-[100%] m-auto py-[20px] xl:py-[40px] px-[10px] lg:px-[20px]'>
          <div className='mb-8'>
            <h1 className='text-[20px] lg:text-[28px] font-[600] mb-2'>Transaction Management</h1>
            <p className='text-[14px] lg:text-[16px] text-gray-600'>View and manage all your transactions</p>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className='bg-white p-4 rounded-lg shadow border border-gray-100'>
              <h3 className='text-gray-500 text-sm font-medium'>Total Deposits</h3>
              <p className='text-2xl font-bold mt-1'>${stats.totalDeposits.toLocaleString()}</p>
            </div>
            <div className='bg-white p-4 rounded-lg shadow border border-gray-100'>
              <h3 className='text-gray-500 text-sm font-medium'>Total Withdrawals</h3>
              <p className='text-2xl font-bold mt-1'>${stats.totalWithdrawals.toLocaleString()}</p>
            </div>
            <div className='bg-white p-4 rounded-lg shadow border border-gray-100'>
              <h3 className='text-gray-500 text-sm font-medium'>Pending Withdrawals</h3>
              <p className='text-2xl font-bold mt-1'>{stats.pendingWithdrawals}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className='mb-6'>
            <ul className='flex border-b border-gray-200'>
              <li 
                className={`px-4 py-2 cursor-pointer ${activetab === 1 ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setactivetab(1)}
              >
                Withdrawals
              </li>
              <li 
                className={`px-4 py-2 cursor-pointer ${activetab === 2 ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setactivetab(2)}
              >
                Deposits
              </li>
            </ul>
          </div>

          {/* Withdrawal Tab Content */}
          {activetab === 1 && (
            <div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden'>
              {/* Table Header */}
              <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium text-gray-900'>Withdrawal Records</h3>
                  <div className='flex space-x-2'>
                    <button 
                      className='px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors'
                      onClick={fetchWithdrawData}
                      disabled={loading.withdraw}
                    >
                      {loading.withdraw ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              {loading.withdraw ? (
                <div className='p-8 text-center'>
                  <p>Loading withdrawal data...</p>
                </div>
              ) : withdrawData.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr className='text-[14px] font-[400]'>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Invoice ID</th>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Amount</th>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Wallet Address</th>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Date</th>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Status</th>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Actions</th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {withdrawData.map((withdraw) => (
                        <tr key={withdraw._id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600'>
                            {withdraw.invoiceId}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium'>
                            ${withdraw.amount}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {withdraw.walletAddress.substring(0, 6)}...{withdraw.walletAddress.substring(withdraw.walletAddress.length - 4)}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {moment(withdraw.createdAt).format('MMM D, YYYY h:mm A')}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span className={`px-2 inline-flex text-[14px] py-1 leading-5 font-semibold rounded-full 
                              ${withdraw.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                withdraw.status === 'fully paid' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {withdraw.status}
                            </span>
                          </td>
                          {/* <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            <button 
                              onClick={() => deleteRecord(withdraw._id, 'withdraw')}
                              className='text-red-500 border-[1px] border-red-500 p-[10px] hover:text-red-700'
                              title='Delete'
                            >
                              <MdDelete size={18} />
                            </button>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='p-8 text-center'>
                  <img className='w-32 mx-auto mb-4' src={empty_image} alt="No data" />
                  <h4 className='text-lg font-medium text-gray-900'>No withdrawal records found</h4>
                  <p className='text-gray-500 mt-1'>Your withdrawal history will appear here</p>
                </div>
              )}
            </div>
          )}

          {/* Deposit Tab Content */}
          {activetab === 2 && (
            <div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden'>
              {/* Table Header */}
              <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium text-gray-900'>Deposit Records</h3>
                  <div className='flex space-x-2'>
                    <button 
                      className='px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors'
                      onClick={fetchDepositData}
                      disabled={loading.deposit}
                    >
                      {loading.deposit ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              {loading.deposit ? (
                <div className='p-8 text-center'>
                  <p>Loading deposit data...</p>
                </div>
              ) : depositData.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-100'>
                    <tr className='text-[14px] font-[400]'>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Invoice ID</th>
                        <th className='px-6 py-3 text-left  text-gray-500 uppercase tracking-wider'>Agent Number</th>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Provider</th>
                        <th className='px-6 py-3 text-left  text-gray-500 uppercase tracking-wider'>Amount</th>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Payer Number</th>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Date</th>
                        <th className='px-6 py-3 text-left text-gray-500 uppercase tracking-wider'>Status</th>
                        <th className='px-6 py-3 text-left  text-gray-500 uppercase tracking-wider'>Actions</th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {depositData.map((deposit) => (
                        <tr key={deposit._id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600'>
                            {deposit.invoice_id}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {deposit.agent_number}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {deposit.provider_name}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium'>
                            ${deposit.amount}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {deposit.payer_number}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {moment(deposit.createdAt).format('MMM D, YYYY h:mm A')}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                             <span className={`px-[10px] inline-flex text-[14px] py-1 leading-5 font-semibold rounded-full 
                              ${deposit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                deposit.status === 'fully paid' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {deposit.status}
                            </span>
                          </td>
                          {/* <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            <button 
                              onClick={() => deleteRecord(deposit._id, 'deposit')}
       className='bg-red-500 text-white border-[1px] border-red-500 p-[10px] hover:bg-red-700 rounded-[5px]'
                              title='Delete'
                            >
                              <MdDelete size={18} />
                            </button>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='p-8 text-center'>
                  <img className='w-32 mx-auto mb-4' src={empty_image} alt="No data" />
                  <h4 className='text-lg font-medium text-gray-900'>No deposit records found</h4>
                  <p className='text-gray-500 mt-1'>Your deposit history will appear here</p>
                </div>
              )}
            </div>
          )}
        </section>
      </section>
    </section>
  )
}

export default Depositandtopup;