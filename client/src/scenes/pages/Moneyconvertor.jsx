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
import { FaBangladeshiTakaSign } from "react-icons/fa6";
const Moneyconvertor = () => {
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
const [currency_info,set_currency_data]=useState([])
const currency_data=()=>{
       axios.get(`${process.env.REACT_APP_BASE_URL2}/currency-price`)
    .then((res)=>{
        set_currency_data(res.data.data)
        console.log(res.data.data)
    }).catch((err)=>{
        console.log(err)
    })
}
// delete_agent
const delete_currency=(id)=>{
    const confirm_box=window.confirm("Are you sure?");
    if(confirm_box){
            axios.delete(`${process.env.REACT_APP_BASE_URL2}/currency-romove/${id}`)
    .then((res)=>{
            if(res.data.success=="true"){
                    return Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text:`${res.data.message}`,
                            showConfirmButton: true,
                          });
            }else{
              return Swal.fire({
                      icon: 'error',
                      title: 'Error!',
                      text: `${res.data.message}`,
                      showConfirmButton: true,
                    });
            }
    }).catch((err)=>{
        console.log(err)
    })
    }
}
useEffect(()=>{
 currency_data();
},[]);
const [dollar_price,setdollar_price]=useState()
const [currency_name,setcurrency_name]=useState("");
const add_dollar_price=(e)=>{
  e.preventDefault();
  if(!dollar_price || !currency_name){
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: "Please fill up your information!",
            showConfirmButton: true,
          });   
  }   if(dollar_price || currency_name==""){
             axios.post(`${process.env.REACT_APP_BASE_URL2}/currency-price`,{price:dollar_price,currency_name}) 
             .then((res)=>{ 
              if(res.data.success){
                     Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: res.data.message,
                        showConfirmButton: true,
               });   
              } else{
                            Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: res.data.message,
            showConfirmButton: true,
          });   
              }
             }).catch((err)=>{
              console.log(err)
             })
       }
  
}
  return (
   <>
     <Box display={isNonMobile ? "flex" : "block"} sx={{display:"flex",justifyContent:'space-between'}} width="100%" height="100%">
<section className="w-full p-6 bg-gray-50 pb-[60px]">
  {/* Form Section */}
  <section   className="w-[100%] lg:w-[60%] xl:w-[40%] p-6 m-auto bg-white rounded-lg shadow-md border border-gray-200">
     <div>
    <h2 className="text-[20px] lg:text-[25px] font-semibold mb-4 text-gray-800">Update Currency Price</h2>
    <p className="text-[16px] text-gray-600">Keep track of currency prices with ease. Add, update, or delete currency entries below.</p>
  </div>
    <form 
    className="mt-[20px]"
      onSubmit={add_dollar_price}
    >
      <h1 className="text-[18px] lg:text-[22px] font-semibold mb-6 text-center text-gray-700">Add Currency Price</h1>

      <div className="mb-6">
        <label htmlFor="currency" className="block text-[16px] font-medium text-gray-700 mb-2">Currency Name</label>
        <select 
          name="currency"
          onChange={(e) => setcurrency_name(e.target.value)}
          id="currency"
          className="w-full h-[50px] px-4 border-[1px] border-[#eee] text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="">Select Currency</option>
          <option value="dollar">Dollar</option>
          <option value="inr">INR</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="price" className="block text-[16px] font-medium text-gray-700 mb-2">Price</label>
        <div className="flex">
          <span className="flex justify-center px-[20px] items-center  text-gray-700 bg-gray-200 border border-r-0 rounded-l-md">
            <FaBangladeshiTakaSign  className="text-2xl" />
          </span>
          <input 
            type="text" 
            id="price"
            onChange={(e) => setdollar_price(e.target.value)} 
            className="flex-1 w-full h-[50px] px-4 border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            placeholder="Enter Price"
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition"
      >
        Submit
      </button>
    </form>
  </section>

  {/* Table Section */}
  <section className="mt-16 w-full">
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Price List</h2>

      <div className="overflow-x-auto mt-[20px]">
    

<div class="relative overflow-x-auto">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-[15px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    ID
                </th>
                <th scope="col" class="px-6 py-3">
                    Currency Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Price
                </th>

                <th scope="col" class="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
          {
            currency_info.map((data,i)=>{
              return(
                   <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 text-[14px] font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {i+1}
                </th>
                <td class="px-6 py-4 text-[14px]">
                   {data.currency_name}
                </td>
                <td class="px-6 py-4 text-[14px]">
                   {data.price}
                </td>
                <td class="px-6 py-4 text-[14px]"onClick={()=>{delete_currency(data._id)}}>
                    <a href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</a>
                </td>
            </tr>
              )
            })
          }
        </tbody>
    </table>
</div>

      </div>
    </div>
  </section>
</section>

    </Box>
   
 
   </>
  );
};

export default Moneyconvertor;
