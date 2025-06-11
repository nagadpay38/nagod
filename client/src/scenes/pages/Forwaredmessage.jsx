import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate  } from "react-router-dom";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
import { useGetApiAccountBkashQuery, generalApi } from "state/api";
import Header from "components/Header";
import { NavLink } from "react-router-dom";
import { FiDollarSign } from "react-icons/fi";
import { DataGrid } from "@mui/x-data-grid";
import { IoFilter } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
// import { merchantTableColumns } from "utilities/CommonUtility";
import DataGridCustomToolbarForMerchants from "components/DataGridCustomToolbarForMerchants";
import Edit from "../bkash/Edit"
import Add from "../bkash/Add";
import Swal from 'sweetalert2';
import Sidebar from "components/Sidebar";
import Navbar from "components/Navbar";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { FaRegEye } from "react-icons/fa";
const transactions = [
  {
    provider: "bkash",
    agentAccount: "01688494103",
    customerAccount: "01688494104",
    transactionType: "payin",
    currency: "BDT",
    transactionAmount: 200000,
    feeAmount: 555,
    balanceAmount: 123123,
    transactionId: "BL38QNrUDF",
    transactionDate: "2024-12-01T12:00:00.000Z",
    status: "arrived",
  },
];

const Forwaredmessage = () => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();
const [find_agent,setfind_agent]=useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

// -------------all forwared message 
const [messages,set_messages]=useState([]);
const forwarded_message=()=>{
    axios.get(`${process.env.REACT_APP_BASE_URL}/user/messages`)
    .then((res)=>{
        set_messages(res.data.data)
    }).catch((err)=>{
        console.log(err)
    })
}
useEffect(()=>{
   forwarded_message()
},[])
  // Filter messages based on the search query
  const filteredMessages = messages.filter((transaction) =>
    Object.values(transaction).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Function to delete a record

  return (
   <>
     <Box display={isNonMobile ? "flex" : "block"} sx={{display:"flex",justifyContent:'space-between'}} width="100%" height="100%">
 <div className="container mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-6">Forwarded Messages Records</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by any field..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-[5px] border border-gray-300">
        <table className="table-auto w-full text-left">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-2">Invoice ID</th>
              <th className="px-4 py-2">Agent Number</th>
              <th className="px-4 py-2">Payer Number</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              {/* <th className="px-4 py-2">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((transaction, index) => (
              <tr
                key={index}
                className={`text-sm ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b hover:bg-gray-100`}
              >
                <td className="px-4 py-2">{transaction._id}</td>
                <td className="px-4 py-2">{transaction.agentAccount}</td>
                <td className="px-4 py-2">{transaction.customerAccount}</td>
                <td className="px-4 py-2">{transaction.provider}</td>
                <td className="px-4 py-2">{transaction.transactionId}</td>
                <td className="px-4 py-2">{transaction.transactionType}</td>
                <td className="px-4 py-2">{transaction.transactionAmount}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      transaction.status === "arrived"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                {/* <td className="px-4 py-2">
                  <button
          
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </td> */}
              </tr>
            ))}

            {/* Show a message if no data matches the search query */}
            {filteredMessages.length === 0 && (
              <tr>
                <td
                  className="px-4 py-[20px] text-[18px] text-center text-gray-500"
                  colSpan="8"
                >
                  No records found.
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

export default Forwaredmessage;
