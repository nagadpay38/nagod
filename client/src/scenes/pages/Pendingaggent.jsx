import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, useTheme, Button, useMediaQuery, TextField, Modal } from "@mui/material";
import { useGetApiAccountBkashQuery, generalApi } from "state/api";
import Header from "components/Header";
import { NavLink } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { IoFilter } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import empty_img from "../../assets/empty.png"
import { GoEye } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { CiCreditCard1 } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import DataGridCustomToolbarForMerchants from "components/DataGridCustomToolbarForMerchants";
import Edit from "../bkash/Edit"
import Add from "../bkash/Add";
import Swal from 'sweetalert2';
import Sidebar from "components/Sidebar";
import Navbar from "components/Navbar";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { FaRegEye } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

const Pendingaggent = () => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { getAuthUser } = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();
  const [find_agent, setfind_agent] = useState("");
  const admin_info = JSON.parse(localStorage.getItem("admin_info"));
  const [pending_agent, setpending_agent] = useState([]);
  const [count_num, setcount_num] = useState(1);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [commissionRate, setCommissionRate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Commission modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px'
  };

  useEffect(() => {
    if (authUser === null || authUser.role === "merchant" || authUser.role === "subadmin") {
      navigate('/login');
    }
  }, [authUser])

  const { data, isLoading, refetch } = useGetApiAccountBkashQuery();

  useEffect(() => {
    if (!isAdding && !isEditing) {
      refetch();
    }
  }, [isAdding, isEditing]);

  const agent_data = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-data`)
      .then((res) => {
        setpending_agent(res.data.pending_agent)
      }).catch((err) => {
        console.log(err)
      })
  }

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
        axios.delete(`${process.env.REACT_APP_BASE_URL2}/agent-delete/${id}`)
          .then((res) => {
            agent_data();
            toast.success("Agent has been deleted!");
          })
          .catch((err) => {
            console.log(err);
            toast.error("Failed to delete agent!");
          });
      }
    });
  };

  const approve_agent = (id) => {
    if (!commissionRate) {
      toast.error("Please set a commission rate");
      return;
    }
    handleCloseApproveModal(); // Close the modal after successful approval
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to approve this agent with ${commissionRate}% commission!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${process.env.REACT_APP_BASE_URL2}/admin/agent-update/${id}`, {
            admin_name: admin_info.name,
            commission_rate: commissionRate
          })
          .then((res) => {
            toast.success(res.data.message);
            setOpenApproveModal(false);
            agent_data(); // Refresh the agent list
          })
          .catch((err) => {
            console.error(err);
            toast.error("Failed to approve agent");
          });
      }
    });
  };

  const handleOpenApproveModal = (agent) => {
    setSelectedAgent(agent);
    setOpenApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    setOpenApproveModal(false);
    setCommissionRate("");
    setSelectedAgent(null);
  };

  const handleStatusToggle = async (agent) => {
    const newStatus = agent.status === 'activated' ? 'deactivated' : 'activated';
    
    // Immediately update the local state for a responsive UI
    const updatedAgents = pending_agent.map(a => 
      a._id === agent._id ? {...a, status: newStatus} : a
    );
    setpending_agent(updatedAgents);

    try {
      setIsUpdating(true);
      setSelectedAgent(agent);
      await axios.put(`${process.env.REACT_APP_BASE_URL2}/agent-update/${agent._id}`, {
        admin_name: admin_info.name,
        status: newStatus
      });
      toast.success(`Agent ${newStatus} successfully`);
    } catch (error) {
      // Revert the change if the API call fails
      setpending_agent(pending_agent);
      toast.error('Failed to update agent status');
      console.error(error);
    } finally {
      setIsUpdating(false);
      setSelectedAgent(null);
    }
  };

  useEffect(() => {
    agent_data();
  }, [])

  return (
    <>
      <Box
        display={{ xs: "block", sm: "flex" }}
        sx={{ display: "flex", justifyContent: 'space-between' }}
        width="100%"
      >
        <Sidebar
          user={authUser || {}}
          isNonMobile={isNonMobile}
          drawerWidth={{
            xs: "100%",
            sm: isSidebarOpen ? "25%" : "0%"
          }}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <Box
          sx={{
            width: {
              xs: "100%",
              sm: isSidebarOpen ? "82%" : "100%"
            },
          }}
        >
          <Navbar
            user={authUser || {}}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          {
            pending_agent.length > 0 ? (
              <section className="p-[20px] ">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-[22px] font-[600] mb-[5px]">Agent Request</h1>
                    <p className="text-[16px] text-neutral-500 font-[400]">Agent Registration Information Before Approve</p>
                  </div>
                  <Toaster />
                  <div className="flex justify-center items-center gap-[15px]">
                    <NavLink to="/numbers">
                      <button className="px-[22px] py-[14px] bg-[#5D87FF] flex justify-center items-center gap-[8px] text-[15px] text-white cursor-pointer rounded-[5px]">Create Agent</button>
                    </NavLink>
                  </div>
                </div>

                <div className="w-full flex justify-between items-center mt-[40px] py-[20px]">
                  {/* Filter and search components */}
                </div>

                <section className="w-full px-[20px] pb-[100px]">
                  <div className="flex flex-col">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 px-[15px]">
                      <div className="inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-[whitesmoke] dark:bg-gray-800">
                              <tr>
                                <th className="px-4 py-[10px] font-[600] text-left text-nowrap uppercase text-sm text-table_title dark:text-gray-300">
                                  Serial Id
                                </th>
                                <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-[600] text-table_title dark:text-gray-300">
                                  Agent
                                </th>
                                <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-[600] text-table_title dark:text-gray-300">
                                  Status
                                </th>
                                <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-medium text-table_title dark:text-gray-300">
                                  Balance
                                </th>
                                <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-[600] text-table_title dark:text-gray-300">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                              {
                                pending_agent.length > 0 ? pending_agent.filter((item) => {
                                  if (find_agent == "") {
                                    return item;
                                  } else if (item.agent_number.toLowerCase().includes(find_agent.toLocaleLowerCase()) || item.provider_name.toLowerCase().includes(find_agent.toLocaleLowerCase()) || item.payer_number.toLowerCase().includes(find_agent.toLocaleLowerCase()) || item.transiction_id.toLowerCase().includes(find_agent.toLocaleLowerCase()) || item.agent_id.toLowerCase().includes(find_agent.toLocaleLowerCase())) {
                                    return item;
                                  }
                                }).map((data, index) => {
                                  return (
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
                                            <p className="text-[15px]  text-gray-600 dark:text-gray-400 font-[600]">{data.accountNumber}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={data.status === 'activated'}
                                            onChange={() => handleStatusToggle(data)}
                                            disabled={isUpdating && selectedAgent?._id === data._id}
                                          />
                                          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
                                            data.status === 'activated' 
                                              ? 'peer-checked:bg-green-500 dark:bg-gray-700 peer-focus:ring-green-500' 
                                              : 'peer-focus:ring-red-500 dark:bg-gray-700'
                                          }`}></div>
                                          <span className={`ml-3 text-sm font-medium ${
                                            data.status === 'activated' 
                                              ? 'text-green-500 dark:text-green-400' 
                                              : 'text-red-500 dark:text-red-400'
                                          }`}>
                                            {data.status === 'activated' ? 'activated' : 'deactivated'}
                                          </span>
                                        </label>
                                      </td>
                                      <td className="px-4 py-4 text-[16px] font-[600] text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                        {data.balance_in_bdt < 100 ? <span className="text-red-500">৳{data.balance_in_bdt}</span> : <span className="text-green-500">৳{data.balance_in_bdt}</span>}
                                      </td>
                                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                                        <div className="flex justify-start items-center gap-[12px] relative">
                                          {/* Approve Button with Tooltip */}
                                          {/* <div 
                                            onClick={() => handleOpenApproveModal(data)}
                                            className="w-[45px] h-[40px] border border-gray-300 rounded-[5px] hover:text-indigo-500 flex justify-center items-center text-[15px] cursor-pointer hover:border-indigo-500 dark:border-gray-700 dark:hover:bg-gray-800 group relative"
                                          >
                                            <FaCheck className="text-[20px]" />
                                            <span className="absolute hidden group-hover:block bottom-[50px] left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-[15px] font-medium rounded px-2 py-0.5 z-10">
                                              Approve
                                              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-indigo-500"></span>
                                            </span>
                                          </div> */}

                                          {/* Edit Button with Tooltip */}
                                          <NavLink to={`/agent-details/${data._id}`} className="w-[45px] h-[40px] border border-gray-300 rounded-[5px] hover:text-indigo-500 flex justify-center items-center text-[15px] cursor-pointer hover:border-indigo-500 dark:border-gray-700 dark:hover:bg-gray-800 group relative">
                                            <CiEdit className="text-[20px]" />
                                            <span className="absolute hidden group-hover:block bottom-[50px] left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-[15px] font-medium rounded px-2 py-0.5 z-10">
                                              Edit
                                              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-indigo-500"></span>
                                            </span>
                                          </NavLink>

                                          {/* Delete Button with Tooltip */}
                                          <div onClick={() => { delete_agent(data._id) }} className="w-[45px] h-[40px] border border-gray-300 rounded-[5px] hover:text-indigo-500 flex justify-center items-center text-[15px] cursor-pointer hover:border-indigo-500 dark:border-gray-700 dark:hover:bg-gray-800 group relative">
                                            <MdDeleteOutline className="text-[20px]" />
                                            <span className="absolute hidden group-hover:block bottom-[50px] left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-[15px] font-medium rounded px-2 py-0.5 z-10">
                                              Delete
                                              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-indigo-500"></span>
                                            </span>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                }) : <h1>Nothing is here to show!</h1>
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </section>
            ) : (
              <section className="w-full h-screen flex justify-center items-center">
                <div>
                  <img className='w-[200px] block m-auto' src={empty_img} alt="" />
                  <h2 className='text-[18px] font-[500] text-center text-neutral-500'>No Data Found!</h2>
                </div>
              </section>
            )
          }
        </Box>
      </Box>

      {/* Approve Agent Modal */}
      <Modal
        open={openApproveModal}
        onClose={handleCloseApproveModal}
        aria-labelledby="approve-agent-modal"
        aria-describedby="approve-agent-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 id="approve-agent-modal" className="text-xl font-bold mb-4">
            Approve Agent: {selectedAgent?.name}
          </h2>
          <div className="mb-4">
            <TextField
              fullWidth
              label="Commission Rate (%)"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              variant="outlined"
              inputProps={{ min: 0, max: 100 }}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outlined"
              color="error"
              onClick={handleCloseApproveModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => approve_agent(selectedAgent?._id)}
              disabled={!commissionRate}
            >
              Approve Agent
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Pendingaggent;