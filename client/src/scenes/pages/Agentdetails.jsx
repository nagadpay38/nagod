import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams  } from "react-router-dom";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
import { useGetApiAccountBkashQuery, generalApi } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { FaEdit } from "react-icons/fa";
import moment from "moment"
import { IoFilter } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
// import { merchantTableColumns } from "utilities/CommonUtility";
import DataGridCustomToolbarForMerchants from "components/DataGridCustomToolbarForMerchants";
import Edit from "../bkash/Edit"
import Add from "../bkash/Add";
import Swal from 'sweetalert2';
import Sidebar from "components/Sidebar";
import Navbar from "components/Navbar";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import empty_img from "../../assets/empty.png"

const Agentdetails = () => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();
const admin_info=JSON.parse(localStorage.getItem("admin_info"));

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
// --------------------agent data
const [agent_information,setagent_information]=useState([]);
const {id}=useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [agent_cashin,set_agentcashin]=useState([]);
  const [agent_cashout,set_agent_cashout]=useState([]);
useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-details/${id}`)
    .then((res)=>{
        console.log("agnet_details",res.data);
        setagent_information(res.data.agent);
        setImageUrl(res.data.agent.nid_or_passport)
        axios.get(`${process.env.REACT_APP_BASE_URL2}/single-agent-cashin/${res.data.agent?.accountNumber}`)
        .then((res)=>{
          set_agentcashin(res.data.data)
        }).catch((err)=>{
          console.log(err)
        })

        // ---------cash-out---------------------
        axios.get(`${process.env.REACT_APP_BASE_URL2}/single-agent-cashout/${res.data.agent?.accountNumber}`)
        .then((res)=>{
          console.log(res)
          set_agent_cashout(res.data.data)
        }).catch((err)=>{
          console.log(err)
        })
    }).catch((err)=>{
        console.log(err)
    })
},[])
// -----------agent all info
    const [agent_deposit_moneyinfo,setagent_deposit_moneyinfo]=useState([]);
   const [total_amount_of_deposit,settotal_amount_of_deposit]=useState();
   const [total_commission,settotal_comission]=useState();
   const [chart_data,setchart_data]=useState([]);
   const [agent_all_info,setagent_all_info]=useState([]);
   const [agent_withdraw_info,set_agent_withdraw_info]=useState([]);
     async function agent_depositinfo(){
        axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-deposit/${id}`)
        .then((res)=>{
          setagent_deposit_moneyinfo(res.data.data);
          setagent_all_info(res.data.agent_information);
          set_agent_withdraw_info(res.data.find_agent_withdraw);
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
const downloadImage = () => {
    const imageUrl = "http://localhost:6001/images/1736942429620_banner1.fd06e9e854e421dd9c72.jpg"; // Replace with the dynamic image URL

    // Create a temporary anchor element for downloading the image
    const link = document.createElement("a");
    link.href = imageUrl;
    link.target="_blank";
    link.download = "downloaded-image.jpg"; // The name of the downloaded file
    
    // Append the link to the DOM (required for the link to work)
    document.body.appendChild(link);

    // Trigger the download by programmatically clicking the link
    link.click();

    // Clean up by removing the link from the DOM after the click
    document.body.removeChild(link);
};


// // -----------------all-cashin-inagent----------------------
// const [agent_cashin,set_agentcashin]=useState([]);
// const [agent_cashout,set_agent_cashout]=useState([]);

// const cash_in=()=>{
//   axios.get(`${process.env.REACT_APP_BASE_URL2}/single-agent-cashin/${agent_information?.accountNumber}`)
//   .then((res)=>{
//     set_agentcashin(res.data.data)
//   }).catch((err)=>{
//     console.log(err)
//   })
// }
// // ----------------all-cashout-in-agent-------------
// const cash_out=()=>{
//   axios.get(`${process.env.REACT_APP_BASE_URL2}/single-agent-cashout/${agent_information?.accountNumber}`)
//   .then((res)=>{
//     console.log(res)
//     set_agent_cashout(res.data.data)
//   }).catch((err)=>{
//     console.log(err)
//   })
// }
// useEffect(()=>{
//   cash_in();
//   cash_out();
// },[])

// ------------------update agent--------------
const approve_agent = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You are about to approve this agent!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, approve!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .put(`${process.env.REACT_APP_BASE_URL2}/agent-update/${id}`, {
          admin_name: admin_info.name,
        })
        .then((res) => {
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
};
const [showPopup, setShowPopup] = useState(false);
const [limitAmount, setLimitAmount] = useState(agent_information?.limit_amount || 0);
const [remainingLimit, setRemainingLimit] = useState(agent_information?.remaining_limit || 0);

const handleUpdate = async () => {
  if (limitAmount < 0 || remainingLimit < 0) {
    toast.error("Values cannot be negative");
    return;
  }
  if (agent_all_info.limitRemaining !== 0) {
    toast.error("You can only update when the remaining limit is 0");
    return;
  }
  try {
    await axios.put(`${process.env.REACT_APP_BASE_URL2}/update-limit`, {
      agentId: agent_information?._id,
      limitAmount,
      remainingLimit,
    });
    toast.success("Limits updated successfully");
    agent_depositinfo();
    setShowPopup(false);
  } catch (error) {
    toast.error("Failed to update limits");
  }
};
// --------download document---------------
  return (
   <>
    <Box 
  display={{ xs: "block", sm: "flex" }} 
  sx={{ display: "flex", justifyContent: 'space-between' }} 
  width="100%" 
>
  {/* Sidebar */}
<Sidebar
  user={authUser || {}}
  isNonMobile={isNonMobile}
  drawerWidth={{
    xs: "100%", // Sidebar takes full width on small screens
    sm: isSidebarOpen ? "25%" : "0%" // 25% width when sidebar is open on larger screens, 0% when closed
  }}
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>

  {/* Main content area */}
  <Box 
    sx={{
      width: {
        xs: "100%", // Full width on small screens
        sm: isSidebarOpen ? "75%" : "100%" // 75% width when sidebar is open on large screens, 100% when closed
      },
    }}
  >
    {/* Navbar */}
    <Navbar
      user={authUser || {}}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    />
      {/* ------------------------agent information------------------- */}
      <section className="w-full min-h-screen no-scrollbar">
      <div className="mb-4">
        <h2 className="text-sm px-[10px] md:text-base text-neutral-400">
          Dashboard / Customers / {agent_information.name}
        </h2>
      </div>
      <Toaster />
      <div className="py-4 flex flex-wrap justify-between px-[10px] items-center">
        <h1 className="text-[18px] lg:text-2xl font-semibold">{agent_information.name}</h1>
        {agent_information.status === "deactivated" ? (
          <button
            className="px-6 py-2 text-white bg-[#5D87FF] rounded-md hover:bg-[#4a76f0] transition-all"
            onClick={approve_agent}
          >
            Approve
          </button>
        ) : imageUrl ? (
          <button
            onClick={downloadImage}
            className="px-6 py-3 text-white bg-[#e84118] rounded-md hover:bg-[#c23616] transition-all"
          >
            Download NID Copy
          </button>
        ) : (
          <p className="text-gray-500">Loading image...</p>
        )}
      </div>
      
      <section className="flex lg:flex-row flex-col px-[10px] gap-3 lg:gap-6">
        {/* Profile Section */}
        <section className="w-full lg:w-[25%] p-6 border border-gray-200">
      <div className="relative bg-indigo-500 text-white text-center p-3 rounded-lg">
        <h2 className="text-sm">Balance: ৳{agent_information?.deposit_amount || 0}</h2>
      </div>
      <div className="text-center mt-6">
        <img
          className="w-24 h-24 mx-auto rounded-full border-4 border-indigo-300"
          src="https://static.vecteezy.com/system/resources/previews/032/187/678/non_2x/employees-and-office-workers-cartoon-characters-free-png.png"
          alt="Agent"
        />
        <h2 className="text-lg font-semibold mt-3">{agent_information.name}</h2>
        <h3 className="text-indigo-600 underline text-sm">{agent_information.email}</h3>
        <h4 className="text-gray-600 text-sm mt-1">{agent_information.phone}</h4>
      </div>
      <div className="mt-4 border-t pt-4 text-sm text-gray-700">
        <p><strong>Address:</strong> Dhaka</p>
        <p><strong>Status:</strong> {agent_information.status}</p>
        <p><strong>Account Created:</strong> {moment(agent_information?.createdAt).fromNow()}</p>
        <div className="flex justify-between items-center mt-2">
          <p><strong>Limit Amount:</strong> ৳{agent_all_info.limitAmount}</p>
          <FaEdit className="text-indigo-600 cursor-pointer" onClick={() => setShowPopup(true)} />
        </div>
        <div className="flex justify-between items-center mt-2">
          <p><strong>Remaining Limit:</strong> ৳{agent_all_info.remaininglimit}</p>
          {/* <FaEdit className="text-indigo-600 cursor-pointer" onClick={() => setShowPopup(true)} /> */}
        </div>
      </div>
      
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Update Limits</h2>
            <label className="block text-sm font-medium">Limit Amount:</label>
            <input
              type="number"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              className="w-full border border-gray-200 rounded p-2 mb-3"
            />
            <label className="block text-sm font-medium">Remaining Limit:</label>
            <input
              type="number"
              value={remainingLimit}
              onChange={(e) => setRemainingLimit(e.target.value)}
              className="w-full border border-gray-200 rounded p-2 mb-3"
              disabled
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-500 text-white rounded">Update</button>
            </div>
          </div>
        </div>
      )}
    </section>
        
        {/* Transactions Section */}
        <section className="w-full lg:w-[75%]">
          {/* Deposit History */}
          <div className="bg-white py-4 ">
            <h2 className="text-lg font-semibold mb-4">Deposit History</h2>
            {agent_cashin.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-gray-200">
                  <thead className="text-xs bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Payer ID</th>
                      <th className="px-4 py-2">Payer Number</th>
                      <th className="px-4 py-2">Transaction</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agent_cashin.map((data) => (
                      <tr className="border-t">
                        <td className="px-4 py-2 text-indigo-500">#{data?.paymentId}</td>
                        <td className="px-4 py-2">{data?.agentAccount}</td>
                        <td className="px-4 py-2">{data?.referenceId}</td>
                        <td className="px-4 py-2">{data?.paymentType}</td>
                        <td
  className={`px-4 py-2 rounded-full  font-medium  ${
    data?.status === "pending"
      ? "text-yellow-500"
      : data?.status === "success"
      ? "text-green-500"
      : data?.status === "cancelled"
      ? "text-red-500"
      : "text-gray-500"
  }`}
>
  {data?.status}
</td>

                        <td className="px-4 py-2">{new Date(data.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-2">৳{data?.expectedAmount}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center p-6">
                <img className="w-24" src={empty_img} alt="No Data" />
                <h1>No deposits found.</h1>
              </div>
            )}
          </div>
          
          {/* Withdraw History */}
          <div className="bg-white py-4">
            <h2 className="text-lg font-semibold mb-4">Withdraw History</h2>
            {agent_cashout.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-gray-200">
                  <thead className="text-xs bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Payment ID</th>
                      <th className="px-4 py-2">Recieved Number</th>
                      <th className="px-4 py-2">Agent Number</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Recieved Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agent_cashout.map((data) => (
                      <tr className="border-t">
                        <td className="px-4 py-2 text-indigo-500">#{data?.paymentId}</td>
                        <td className="px-4 py-2">{data?.payeeAccount}</td>
                        <td className="px-4 py-2">{data?.agent_account}</td>
                        <td
  className={`px-4 py-2 rounded-full  font-medium  ${
    data?.status === "pending"
      ? "text-yellow-500"
      : data?.status === "success"
      ? "text-green-500"
      : data?.status === "cancelled"
      ? "text-red-500"
      : "text-gray-500"
  }`}
>
  {data?.status}
</td>
                        <td className="px-4 py-2">{new Date(data.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-2">৳{data?.sentAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center p-6">
                <img className="w-24" src={empty_img} alt="No Data" />
                <h1>No withdrawals found.</h1>
              </div>
            )}
          </div>
        </section>
      </section>
    </section>
      {/* ------------------------agent information------------------- */}
      </Box>
    </Box>
   
 
   </>
  );
};

export default Agentdetails;
