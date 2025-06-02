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
import WalletAddressForm from "./WalletAddressForm";
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

const Walletaddress = () => {
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

  return (
   <>
     <Box display={isNonMobile ? "flex" : "block"} sx={{display:"flex",justifyContent:'space-between'}} width="100%"className="min-h-[80vh] overflow-y-auto">
       <WalletAddressForm/>
    </Box>
   
 
   </>
  );
};

export default Walletaddress;
