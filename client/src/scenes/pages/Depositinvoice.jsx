import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams  } from "react-router-dom";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
import { useGetApiAccountBkashQuery, generalApi } from "state/api";
import Header from "components/Header";
import { NavLink } from "react-router-dom";
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
import jsPDF from "jspdf";
const Depositinvoice = () => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();
  const {id}=useParams();
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
const [count_num,setcount_num]=useState(1)

// delete_agent
const delete_agent=(id)=>{
    const confirm_box=window.confirm("Are you sure?");
    if(confirm_box){
            axios.delete(`${process.env.REACT_APP_BASE_URL2}/agent-delete/${id}`)
    .then((res)=>{
            toast.success("Agent has been deleted!");
    }).catch((err)=>{
        console.log(err)
    })
    }
}
useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-data`)
    .then((res)=>{
        setagent_information(res.data.agent)
    }).catch((err)=>{
        console.log(err)
    })
},[]);

const [invoiceData,set_invoice_info]=useState([])
const invoice_data=()=>{
       axios.get(`${process.env.REACT_APP_BASE_URL2}/invoice-details/${id}`)
    .then((res)=>{
        set_invoice_info(res.data.data)
        console.log(res.data.data)
    }).catch((err)=>{
        console.log(err)
    })
}
useEffect(()=>{
   invoice_data();
},[])
// ------------------print invoice----------------
 const handlePrint = () => {
    const printContents = document.getElementById("invoice-content").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

const handleDownloadPDF = () => {
  const content = document.getElementById("invoice-content");
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4",
  });

  doc.html(content, {
    callback: function (doc) {
      doc.save(`${invoiceData.invoice_id}.pdf`);
    },
    x: 10,
    y: 10,
    html2canvas: {
      scale: 2, // Improves quality of the rendered PDF
      useCORS: true, // Handles cross-origin images
    },
  });
};


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
      <section className="py-[40px]">
   {/* Invoice */}
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
      <div className="sm:w-11/12 lg:w-3/4 mx-auto">
        <div id="invoice-content" className="flex flex-col p-6 sm:p-10 bg-[whitesmoke] border-[1px] border-[#eee] shadow-md rounded-xl dark:bg-neutral-800">
          <div className="flex justify-between">
            <div>
              <img
                className="w-[100px]"
                src="http://localhost:3000/static/media/easypay-logo.f538d670857a9bc36f55.png"
                alt="EasyPay Logo"
              />
              <h1 className="mt-2 text-lg md:text-xl font-semibold text-blue-600 dark:text-white">
                EassyPay
              </h1>
            </div>
            <div className="text-end">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-neutral-200">
                Invoice
              </h2>
              <span className="mt-1 block text-gray-500 dark:text-neutral-500">
                {invoiceData.invoice_id}
              </span>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                Bill to:
              </h3>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                {invoiceData.payer_number}
              </h3>
              <address className="mt-2 not-italic text-gray-500 dark:text-neutral-500">
                Agent: {invoiceData.agent_number}<br /> Provider: {invoiceData.provider_name}
              </address>
            </div>
            <div className="sm:text-end space-y-2">
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 text-[15px] font-semibold text-gray-800 dark:text-neutral-200">
                  Invoice date:
                </dt>
                <dd className="col-span-2 text-[15px] text-gray-500 dark:text-neutral-500">
                  {new Date(invoiceData.createdAt).toLocaleDateString()}
                </dd>
              </dl>
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 text-[15px] font-semibold text-gray-800 dark:text-neutral-200">
                  Status:
                </dt>
                <dd className={`col-span-2 text-[15px] font-medium ${invoiceData.status === "fully paid" ? "text-green-600" : "text-red-600"}`}>
                  {invoiceData.status}
                </dd>
              </dl>
            </div>
          </div>

          <div className="mt-6">
            <div className="border border-gray-200 p-4 rounded-lg space-y-4 dark:border-neutral-700">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                <div className="col-span-full sm:col-span-2">
                  <p className="font-medium text-[16px] text-gray-800 dark:text-neutral-200">Transaction ID</p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-[16px] text-blue-600 dark:text-blue-400">
                    {invoiceData.transiction_id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex sm:justify-end">
            <div className="w-full max-w-2xl sm:text-end space-y-2">
              <dl className="flex justify-center items-center gap-[5px]">
                <dt className="col-span-3 text-[17px] font-semibold text-gray-800 dark:text-neutral-200">
                  Amount:
                </dt>
                <dd className="col-span-2 text-[17px] font-[500] text-gray-800 dark:text-green-400">
                  ${invoiceData.amount?.toFixed(2) || "0.00"}
                </dd>
              </dl>
            </div>
          </div>

          <div className="mt-8 sm:mt-12">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Thank you!
            </h4>
            <p className="text-gray-500 dark:text-neutral-500">
              If you have any questions concerning this invoice, use the following
              contact information:
            </p>
            <div className="mt-2">
              <p className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
              eassypay@gmail.com
              </p>
              <p className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
               01829232467
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-500 dark:text-neutral-500">© 2025 Eassypay.</p>
        </div>

        <div className="mt-6 flex justify-end gap-x-3">
          <button
            className="py-[10px] px-[20px]  inline-flex items-center cursor-pointer gap-x-2 text-sm font-medium bg-orange-500 rounded-lg border border-gray-200 text-white  shadow-sm hover:bg-orange-700 focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
          <button
            className="py-[10px] px-[20px] inline-flex cursor-pointer items-center gap-x-2 text-[16px]  font-medium rounded-lg border border-transparent bg-indigo-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      </div>
    </div>
{/* End Invoice */}

      </section>
     
      {/* ------------------------agent information------------------- */}
      </Box>
    </Box>
   
 
   </>
  );
};

export default Depositinvoice;
