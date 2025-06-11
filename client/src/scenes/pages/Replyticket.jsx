import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams  } from "react-router-dom";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
import { useGetApiAccountBkashQuery, generalApi } from "state/api";
import moment from "moment"
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
const Replyticket = () => {
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
    // Scroll to the bottom of the page after the component mounts
    window.scrollTo(0, document.body.scrollHeight);
  }, []); 
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
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const {id}=useParams();
  const [message, setMessage] = useState('');
const [ticket_data,setticket_data]=useState([]);
      function ticket_information(){
        axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-ticket-data/${id}`)
        .then((res)=>{
          setticket_data(res.data.data)
          console.log(res.data)
        }).catch((err)=>{
          console.log(err)
        })
       }
    useEffect(()=>{
       ticket_information();
    },[]);

  const handleReplyClick = () => {
    setIsReplyOpen(!isReplyOpen);
  };

  const handlePostMessage = (e) => {
    e.preventDefault();
  if(message==""){
       return Swal.fire({
                           icon: 'warning',
                           title: 'warning!',
                           text: `Please enter message!`,
                           showConfirmButton: true,
                         });

  }else if(!message==""){
    axios.post(`${process.env.REACT_APP_BASE_URL2}/agent-reply`,{name:"admin",email:"admin@gmail.com",message,ticket_id:id,role:"admin"})
    .then((res)=>{
          if(res.data.success==true){
            setMessage("")
       ticket_information();

  return Swal.fire({
                           icon: 'success',
                           title: 'success!',
                           text: `${res.data.message}`,
                           showConfirmButton: true,
                         });
          }
    }).catch((err)=>{
        console.log(err)
    })
  }
  };
  return (
   <>
     <Box display={isNonMobile ? "flex" : "block"} sx={{display:"flex",justifyContent:'space-between'}} width="100%" height="100%">
<div className="p-4 w-[100%] pb-[60px]">
      <h1 className="text-2xl font-bold mb-4">Ticket #{ticket_data.id} </h1>
      <div className="text-sm text-gray-500 mb-2">Home / Agent Area / Support Tickets / View Ticket</div>
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4">
        You can reply to this ticket.
      </div>
      <div className="bg-blue-100 p-4 rounded flex justify-between items-center">
        <span className="text-blue-800 font-semibold">Reply</span>
        <button
          onClick={handleReplyClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          +
        </button>
      </div>

{
  ticket_data.map((data, index) => {
    // Determine if the next box should have an arrow to the current box
    return (
      <div>
        {
          data.role=="agent"?
          <div key={data.id} className="relative p-4 w-[80%] bg-white shadow rounded mt-4">
        {/* Add Curved Arrow Line */}

        <div
          className={`flex items-center mb-2 ${data.role === 'agent' ? 'justify-start' : 'justify-end'}`}
        >
          <div className={`w-8 h-8 rounded-full ${data.role === 'agent' ? 'bg-orange-300' : 'bg-green-300'} mr-2`}>
            <img
              src="https://www.aiscribbles.com/img/variant/large-preview/9570/?v=5528a6"
              className="w-[60px]"
              alt=""
            />
          </div>
          <div>
            <span className="font-semibold">{data.name}</span>
            <span className="ml-2 text-orange-700 bg-orange-100 px-2 py-1 rounded text-xs">{data.role}</span>
          </div>
          <span className="ml-auto text-gray-500 text-sm">{moment(data?.createdAt).fromNow()}</span>
        </div>
        <p className="text-gray-700 mt-[30px]">{data.message}</p>
      </div>:
      <div className="w-[100%] flex justify-end items-center">
        <div key={data.id} className="relative p-4 w-[80%] bg-white shadow rounded mt-4">
        {/* Add Curved Arrow Line */}

        <div
          className={`flex items-center mb-2 ${data.role === 'agent' ? 'justify-start' : 'justify-end'}`}
        >
          <div className={`w-8 h-8 rounded-full ${data.role === 'agent' ? 'bg-orange-300' : 'bg-green-300'} mr-2`}>
            <img
              src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-11.webp"
              className="w-[60px]"
              alt=""
            />
          </div>
          <div>
            <span className="font-semibold">{data?.name}</span>
            <span className="ml-2 text-green-700 bg-green-100 px-2 py-1 rounded text-xs">{data?.role}</span>
          </div>
          <span className="ml-auto text-gray-500 text-sm">{moment(data?.createdAt).fromNow()}</span>
        </div>
        <p className="text-gray-700 mt-[30px]">{data?.message}</p>
      </div>
      </div>
        }
      </div>
    );
  })
}



      {isReplyOpen && (
        <form onSubmit={handlePostMessage} className="mt-4 p-4 bg-gray-50 border rounded">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows="4"
            placeholder="Type your reply here..."
          ></textarea>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Post Reply
            </button>
          </div>
        </form>
      )}
    </div>   
    </Box>
   
 
   </>
  );
};

export default Replyticket;
