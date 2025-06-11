import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams  } from "react-router-dom";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
import { useGetApiAccountBkashQuery, generalApi } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
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

const Merchantdetails = () => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();
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

useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-details/${id}`)
    .then((res)=>{
        console.log(res);
        setagent_information(res.data.agent);
        setImageUrl(res.data.agent.nid_or_passport)
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
        axios.get(`${process.env.REACT_APP_BASE_URL2}/api/user/merchant-details/${id}`)
        .then((res)=>{
          setagent_deposit_moneyinfo(res.data.deposit);
          setagent_all_info(res.data.data);
          console.log(res.data.data)
          set_agent_withdraw_info(res.data.withdraw);
          console.log(res.data.deposit)
        //   const formattedData = res.data.data.map((transaction) => ({
        //             timestamp: new Date(transaction.createdAt).toLocaleDateString(), // Format timestamp
        //             amount: transaction.amount,
        //         }));
        //         setchart_data(formattedData)
          settotal_amount_of_deposit(res.data.deposit);
        //   settotal_comission(res.data.total_commission);
        }).catch((err)=>{
          console.log(err)
        })
       }
    useEffect(()=>{
       agent_depositinfo();
       console.log(agent_all_info)
    },[]);
     const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Calculate total pages
  const totalPages = Math.ceil(agent_deposit_moneyinfo.length / itemsPerPage);

  // Get current page data
  const currentData = agent_deposit_moneyinfo.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate pagination numbers with dots
  const getPaginationNumbers = () => {
    const paginationNumbers = [];
    if (totalPages <= 5) {
      // Show all pages if total pages are less than or equal to 5
      for (let i = 1; i <= totalPages; i++) {
        paginationNumbers.push(i);
      }
    } else {
      // Show first page, last page, and dots
      paginationNumbers.push(1);
      if (currentPage > 3) paginationNumbers.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        paginationNumbers.push(i);
      }
      if (currentPage < totalPages - 2) paginationNumbers.push("...");
      paginationNumbers.push(totalPages);
    }
    return paginationNumbers;
  };
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




// ------------------update agent--------------
const approve_agent=()=>{
  const confirm_box=window.confirm("Are you sure?");
  if(confirm_box){
    axios.put(`${process.env.REACT_APP_BASE_URL2}/api/user/merchant-details/${id}`)
    .then((res)=>{
        toast.success(res.data.message)
    }).catch((err)=>{
        console.log(err)
    })
  }

}

// --------download document---------------
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
  
      {/* ------------------------agent information------------------- */}
       <section className="w-full p-[30px] bg-[#F5F7FA] h-auto no-scrollbar">
          <div>
            <h2 className="text-[14px] text-neutral-400">Dashboard / Customers / {agent_all_info?.name}</h2>
          </div>
          <Toaster/>
       
          <section className="flex justify-center gap-[20px]">
              <section className="w-[30%] p-[20px] relative h-[100%] bg-white border-[1px] border[#eee] ">
                      {/* <div className="absolute top-[2%] left-[2%] px-[15px] py-[5px] text-[13px] text-white bg-[#5D87FF] rounded-[25px] flex justify-center gap-[5px] items-center ">
                        <h2>Deposit</h2>
                        <h2>:</h2>

<h2>{agent_all_info?.total_deposit || 0}</h2>

                      </div> */}
                      <div className=" pb-[20px]">
                        <img className="w-[100px] block m-auto h-[100px] border-[2px] border-[#eee] rounded-full"   src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${agent_all_info?.name}`} alt="" />
                         <h2 className="text-[18px] font-[600] mt-[15px] text-center text-[#212529]">{agent_all_info?.name}</h2>
                         <h3 className="text-[15px] font-[600] mt-[2px] underline text-center text-[#4b7bec]">{agent_all_info.email}</h3>
                         <h4 className="text-[13px] font-[600] mt-[5px]  text-center text-orange-600">{agent_all_info.websiteUrl}</h4>
                      </div>
                      {/* <div className="py-[20px] border-t-[1px] border-[#eee]">
                         <div className="grid grid-cols-2 gap-[20px] mb-[10px]">
                            <h1 className="text-[15px] ">Address :</h1>
                            <h1 className="text-[15px] text-neutral-600">Dhaka</h1>
                         </div>
                            <div className="grid grid-cols-2 gap-[20px] mb-[10px]">
                            <h1 className="text-[15px] ">Status :</h1>
                            <h1 className="text-[15px] text-neutral-600">{agent_information.status}</h1>
                         </div>
                            <div className="grid grid-cols-2 gap-[20px] mb-[10px]">
                            <h1 className="text-[15px] ">Account Created :</h1>
                            <h1 className="text-[15px] text-neutral-600">             {moment(agent_information?.createdAt).fromNow()}</h1>
                         </div>
              
                      </div> */}
              </section>
              <section className="w-[70%] h-auto ">
    <div className="w-full h-auto bg-white border-[1px] border[#eee] p-[20px]">
                       <h2 className="text-[18px] font-[600] mb-[15px]">Deposit Histroy</h2>
                

{
  agent_deposit_moneyinfo.length > 0 ? <div className="relative overflow-x-auto">
<div>
      {/* Table */}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Payment ID
            </th>
            <th scope="col" className="px-6 py-3">
              Provider
            </th>
            <th scope="col" className="px-6 py-3">
              Amount
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((data) => (
            <tr key={data.paymentId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-indigo-400 whitespace-nowrap dark:text-white"
              >
                #{data.paymentId}
              </th>
              <td className="px-6 py-4">{data.provider}</td>
              <td className="px-6 py-4">৳ {data.expectedAmount}</td>
              <td className="px-6 py-4">{moment(data?.createdAt).fromNow()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <ul className="inline-flex items-center -space-x-px">
          {/* Previous Button */}
          <li>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 leading-tight text-white bg-indigo-500 border border-indigo-500 rounded-l-lg hover:bg-indigo-600 hover:text-white ${
                currentPage === 1 && "opacity-50 cursor-not-allowed"
              }`}
            >
              Previous
            </button>
          </li>

          {/* Pagination Numbers */}
          {getPaginationNumbers().map((page, index) => (
            <li key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 leading-tight border ${
                    currentPage === page
                      ? "text-white bg-indigo-500 border-indigo-500"
                      : "text-gray-500 bg-white border-gray-300 hover:bg-indigo-100 hover:text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          {/* Next Button */}
          <li>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 leading-tight text-white bg-indigo-500 border border-indigo-500 rounded-r-lg hover:bg-indigo-600 hover:text-white ${
                currentPage === totalPages && "opacity-50 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
</div>:<section className="w-full flex justify-center items-center p-[20px]">
      <div>
        <img className="w-[100px]" src={empty_img} alt="" />
        <h1>No deposit Found.</h1>
      </div>
</section>
}
    </div>
   {
    agent_withdraw_info.length > 0 ?  <div className="w-full h-auto bg-white border-[1px] border[#eee] p-[20px] mt-[20px]">
                       <h2 className="text-[18px] font-[600] mb-[15px]">Withdraw Histroy</h2>
                

<div className="relative overflow-x-auto">
  <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-[1px] border-[#eee] border-dashed dark:text-gray-400 ">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">
          Pament ID
        </th>
        <th scope="col" className="px-6 py-3">
          Recieve Account
        </th>
          <th scope="col" className="px-6 py-3">
          Time
        </th>
        <th scope="col" className="px-6 py-3">
          Amount
        </th>
      </tr>
    </thead>
<tbody>
  {
    agent_withdraw_info.map((data)=>{
      return(
  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row" className="px-6 py-4 font-medium text-indigo-400 whitespace-nowrap dark:text-white">
          #{data.paymentId}
        </th>
        <td className="px-6 py-4">
          {data.payeeAccount}
        </td>
                <td className="px-6 py-4">
                        {moment(data?.createdAt).fromNow()}
        </td>
        <td className="px-6 py-4 text-green-500 font-[600]">
         ৳ {data.sentAmount}
        </td>
      </tr>
      )
    })
  }
    

    </tbody>
  </table>
</div>
    </div>:<section className="w-full flex justify-center items-center p-[20px]">
      <div>
        <img className="w-[100px]" src={empty_img} alt="" />
        <h1>No Withdraw Found.</h1>
      </div>
</section>
   }
              </section>
          </section>
          {/* ------------------------profile information------------------------ */}
      </section>
           <section className="w-full py-[20px] border-t-[1px] bg-[#F5F7FA] border-[#eee]">
           <p className="text-[16px] text-neutral-600 text-center">All Copyright reserved by EassyPay</p>
      </section>
      {/* ------------------------agent information------------------- */}
      </Box>
    </Box>
   
 
   </>
  );
};

export default Merchantdetails;
