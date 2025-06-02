import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate  } from "react-router-dom";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
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
const Createuser = () => {
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
const [pending_agent,setpending_agent]=useState([]);
const [count_num,setcount_num]=useState(1)

// delete_agent
const [name,set_name]=useState("");
const [email,set_email]=useState("");
const [password,set_password]=useState("");
const handle_form = (e) => {
    e.preventDefault();
    if(name=="" || email=="" || password==""){

    } else if(!name=="" || !email=="" || password==""){
        // Proceed with the delete operation if confirmed
        axios.post(`${process.env.REACT_APP_BASE_URL2}/api/auth/register`,{name,email,password})
        .then((res) => {
            if(res.data.success){
                Swal.fire({
                    title: 'Success',
                    text: `${res.data.message}`,
                    icon: 'success',
                })
            }else{
                Swal.fire({
                    title: 'error',
                    text: `${res.data.message}`,
                    icon: 'error',
                })
            }
        })
        .catch((err) => {
            console.log(err);
            toast.error("Failed to delete agent!");
        });
    }
};

  return (
   <>
   <Box 
  display={{ xs: "block", sm: "flex" }} 
  sx={{ display: "flex", justifyContent: 'space-between' }} 
  width="100%" 
>
  
  {/* Main content area */}
  <Box 
    sx={{
      width: {
        xs: "100%", // Full width on small screens
        sm: isSidebarOpen ? "100%" : "100%" // 75% width when sidebar is open on large screens, 100% when closed
      },
    }}
  >

    <section className="p-[30px]">
        <h1 className="text-[30px] font-[600] mb-[20px]">Create User</h1>
<form onSubmit={handle_form}>
  <div className="relative mb-6">
    <label className="flex  items-center mb-2 text-gray-600 text-[16px] font-medium">Username <svg width={7} height={7} className="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444" />
      </svg>
    </label>
    <input type="text" id="default-search"value={name} onChange={(e)=>{set_name(e.target.value)}} className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-[5px] placeholder-gray-400 focus:outline-none " placeholder required />
  </div>
  <div className="relative mb-6">
    <label className="flex  items-center mb-2 text-gray-600 text-[16px] font-medium">Email <svg width={7} height={7} className="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444" />
      </svg>
    </label>
    <input type="email" id="default-search"value={email} onChange={(e)=>{set_email(e.target.value)}} className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-[5px] placeholder-gray-400 focus:outline-none " placeholder required />

  </div>
  <div className="relative mb-6">
    <label className="flex  items-center mb-2 text-gray-600 text-[16px] font-medium">Password <svg width={7} height={7} className="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444" />
      </svg>
    </label>
    <input type="password" id="default-search"value={password} onChange={(e)=>{set_password(e.target.value)}} className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-[5px] placeholder-gray-400 focus:outline-none " placeholder required />

  </div>
  <button className="w-52 h-12 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 rounded-full shadow-xs text-white text-base font-semibold leading-6 mb-6">Submit</button>
</form>

    </section>

  </Box>
</Box>
   
 
   </>
  );
};

export default Createuser;
