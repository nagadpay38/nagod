import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { NavLink } from "react-router-dom";
import Swal from 'sweetalert2';
import Sidebar from "components/Sidebar";
import Navbar from "components/Navbar";
import axios from "axios";
import toast from 'react-hot-toast';
import { GoEye } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { FaSearch, FaFilter } from 'react-icons/fa'; 
const Merchanttable = () => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { getAuthUser } = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDeposits, setFilterDeposits] = useState("");
  const [filterWithdrawals, setFilterWithdrawals] = useState("");

  useEffect(() => {
    if (authUser === null || authUser.role === "merchant" || authUser.role === "subadmin") {
      navigate('/login');
    }
  }, [authUser]);

  const merchant_data = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/user/merchant`)
      .then((res) => {
        setMerchant(res.data.data);
      }).catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    merchant_data();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (type, value) => {
    if (type === "deposit") {
      setFilterDeposits(value);
    } else if (type === "withdraw") {
      setFilterWithdrawals(value);
    }
  };

const delete_agent = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`${process.env.REACT_APP_BASE_URL2}/api/user/delete-merchant/${id}`)
        .then((res) => {
          Swal.fire({
            title: 'Deleted!',
            text: 'The merchant has been successfully deleted.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          merchant_data(); // Refresh data
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to delete agent!");
        });
    }
  });
};


  // Filtered merchants based on search and filters
  const filteredMerchants = merchant.filter((data) => {
    const isDepositFiltered =
      filterDeposits === "" || (filterDeposits === "high" ? data.total_deposit >= 100 : data.total_deposit < 100);
    const isWithdrawFiltered =
      filterWithdrawals === "" || (filterWithdrawals === "high" ? data.total_withdraw >= 100 : data.total_withdraw < 100);
    const isSearchFiltered =
      searchQuery === "" ||
      data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.websiteUrl.includes(searchQuery);

    return isDepositFiltered && isWithdrawFiltered && isSearchFiltered;
  });

  return (
    <>
      <Box display={isNonMobile ? "flex" : "block"} sx={{ display: "flex", justifyContent: 'space-between' }} width="100%" height="100%">
        <div className="container mx-auto my-8 p-4">
          <h1 className="text-2xl font-bold mb-6">Merchant List</h1>

          {/* Search Input */}
          <div className="mb-4 flex justify-between">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search merchant..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />

            {/* Filter Buttons */}
            <div className="flex space-x-4">
              <select
                onChange={(e) => handleFilterChange("deposit", e.target.value)}
                value={filterDeposits}
                className="w-auto px-[30px] py-2 border border-[#eee] rounded-[5px]"
              >
                <option value="">Filter by Deposit</option>
                <option value="low">Low Deposit</option>
                <option value="high">High Deposit</option>
              </select>

              <select
                onChange={(e) => handleFilterChange("withdraw", e.target.value)}
                value={filterWithdrawals}
                className="px-4 py-2 border border-[#eee] rounded-[5px]"
              >
                <option value="">Filter by Withdrawal</option>
                <option value="low">Low Withdrawal</option>
                <option value="high">High Withdrawal</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-[5px] border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-[whitesmoke] dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-[10px] font-[600] text-left text-nowrap uppercase text-sm text-table_title dark:text-gray-300">
                    Serial Id
                  </th>
                  <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-[600] text-table_title dark:text-gray-300">
                    Merchant
                  </th>
                  <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-[600] text-table_title dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-[600] text-table_title dark:text-gray-300">
                    Total Deposit
                  </th>
                  <th className="px-4 py-2 text-left font-[600] text-nowrap uppercase text-sm text-table_title dark:text-gray-300">
                    Total Withdraw
                  </th>
                  <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-[600] text-table_title dark:text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {
                  filteredMerchants.length > 0 ? filteredMerchants.map((data, index) => (
                  <tr key={index}>
                            <td className="px-4 py-[10px] text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              <div className="inline-flex items-center gap-x-3">
                                <input
                                  type="checkbox"
                                  className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                                />
                                <span className="text-[16px] text-orange-500">#{index + 1}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              <div className="flex items-center gap-x-4">
                                <img
                                  className="object-cover w-[50px] h-[50px] rounded-[5px] border-[1px] border-[#eee]"
                                  src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${data.name}`}
                                  alt="Agent"
                                />
                                <div>
                                  <h2 className="text-[16px] font-[600] text-gray-800 capitalize dark:text-white">{data.name}</h2>
                                  <p className="text-[15px]  text-orange-600 dark:text-gray-400 font-[600]">{data.websiteUrl}</p>
                                </div>
                              </div>
                            </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  {data.status === "deactivated" ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={false}
                        // onChange={() => updateStatus(data._id, "activated")} // Replace with your status update logic
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 dark:bg-gray-700 peer-checked:bg-green-500 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                      <span className="ml-3 text-sm font-medium text-red-500 dark:text-red-400">Inactive</span>
                    </label>
                  ) : (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={true}
                        // onChange={() => updateStatus(data._id, "deactivated")} // Replace with your status update logic
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 dark:bg-gray-700 peer-checked:bg-green-500 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                      <span className="ml-3 text-sm font-medium text-green-500 dark:text-green-400">Active</span>
                    </label>
                  )}
                </td>
                
                
                            <td className="px-4 py-4 text-[16px] font-[600] text-gray-500 dark:text-gray-300 whitespace-nowrap">
                               {data.total_deposit <  100 ? <span className="text-red-500">৳{data.total_deposit || 0}</span>:<span className="text-green-500">৳{data.total_deposit || 0}</span>}
                            </td>
                              <td className="px-4 py-4 text-[16px] font-[600] text-gray-500 dark:text-gray-300 whitespace-nowrap">
                               {data.total_withdraw <  100 ? <span className="text-red-500">৳{data.total_withdraw || 0}</span>:<span className="text-green-500">৳{data.total_withdraw || 0}</span>}
                            </td>
                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                 <div className="flex justify-start items-center gap-[12px] relative">
                                  {/* View Button with Tooltip */}
                                  {/* <div className="w-[45px] h-[40px]  border border-gray-300 rounded-[5px] hover:text-indigo-500 flex justify-center items-center text-[15px] cursor-pointer hover:border-indigo-500 dark:border-gray-700 dark:hover:bg-gray-800 group relative">
                                    <GoEye className="text-[20px]" />
                                   <span className="absolute hidden group-hover:block bottom-[50px] left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-[15px] font-medium rounded px-2 py-0.5 z-10">
                    View
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-indigo-500"></span>
                  </span>
                                  </div> */}
                
                                  {/* Edit Button with Tooltip */}
                                  <NavLink  to={`/merchant_details/${data._id}`} className="w-[45px] h-[40px]   border border-gray-300 rounded-[5px] hover:text-indigo-500 flex justify-center items-center text-[15px] cursor-pointer hover:border-indigo-500 dark:border-gray-700 dark:hover:bg-gray-800 group relative">
                                    <GoEye className="text-[20px]" />
                                   <span className="absolute hidden group-hover:block bottom-[50px] left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-[15px] font-medium rounded px-2 py-0.5 z-10">
                    View
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-indigo-500"></span>
                  </span>
                                  </NavLink>
                
                                  {/* Delete Button with Tooltip */}
                              <div onClick={()=>{delete_agent(data._id)}} className="w-[45px] h-[40px]   border border-gray-300 rounded-[5px] hover:text-indigo-500 flex justify-center items-center text-[15px] cursor-pointer hover:border-indigo-500 dark:border-gray-700 dark:hover:bg-gray-800 group relative">
                  <MdDeleteOutline className="text-[20px]"/>
                  <span className="absolute hidden group-hover:block bottom-[50px] left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-[15px] font-medium rounded px-2 py-0.5 z-10">
                    Delete
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-indigo-500"></span>
                  </span>
                </div>
                
                                </div>
                              {/* <div className="flex items-center gap-x-6">
                                <NavLink to={`/agent-details/${data._id}`}>
                                  <button className="transition-colors duration-200 p-[12px] rounded-[5px] bg-[#6A3FFF] text-[23px] text-white dark:hover:text-indigo-500 dark:text-gray-300 hover:text-indigo-500 focus:outline-none">
                                    <FaRegEdit />
                                  </button>
                                </NavLink>
                                <button
                                  onClick={() => {
                                    delete_agent(data._id);
                                  }}
                                  className="p-[12px] transition-colors duration-200 rounded-[5px] bg-[#eb3b5a] text-[23px] text-white hover:text-indigo-500 focus:outline-none"
                                >
                                  <MdOutlineDelete />
                                </button>
                              </div> */}
                            </td>
                          </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                        No merchants found.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </Box>
    </>
  );
};

export default Merchanttable;
