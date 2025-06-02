import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import { LuPlus } from "react-icons/lu";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
 import { IoClose } from "react-icons/io5";
 import moment from "moment"
import { customAlphabet } from 'nanoid';
import { CgMenuLeftAlt } from "react-icons/cg";
import axios from 'axios'
import Swal from 'sweetalert2';
import { BiSend } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { CgMenuRightAlt } from "react-icons/cg";
import { Contextapi } from 'context/Appcontext';
import Dashboardleftside from 'components/agentcomponents/Dashboardleftside';
import Dashboradheader from 'components/agentcomponents/Dashboardheader';
import { MdContentCopy } from "react-icons/md";
import btc_img from "../../assets/bitcoin.png"
import usdt_img from "../../assets/usdt.png"
import toast, { Toaster } from 'react-hot-toast';

const Viewticket = () => {
   const navigate=useNavigate();
       const agent_info=JSON.parse(localStorage.getItem("agent_info"));
     const {activesidebar,setactivesidebar,activetopbar,setactivetopbar}=useContext(Contextapi);
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
    axios.post(`${process.env.REACT_APP_BASE_URL2}/agent-reply`,{message,ticket_id:id,role:"agent"})
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
    <section className='w-full h-[100vh] flex font-poppins'>
        <section className={activesidebar ? 'lg:w-[7%] h-[100vh] transition-all duration-300 overflow-hidden':'w-0 md:w-[18%] transition-all duration-300 h-[100vh]'}>
            <Dashboardleftside/>
            <Toaster/>
        </section>
        <section className={activesidebar ? 'w-[100%] lg:w-[93%] h-[100vh] bg-[#EFEFFD] overflow-y-auto transition-all duration-300':' transition-all bg-[#EFEFFD] duration-300 w-[100%] overflow-y-auto md:w-[82%] h-[100vh]'}>
        <Dashboradheader/> 
       <section className='p-[30px]'>          
<div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ticket #{id} </h1>
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
      {isReplyOpen && (
        <div className="mt-4 p-4 bg-gray-50 border rounded">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows="4"
            placeholder="Type your reply here..."
          ></textarea>
          <div className="flex justify-end">
            <button
              onClick={handlePostMessage}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Post Reply
            </button>
          </div>
        </div>
      )}
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

  
    </div> 
                      
       </section>
        </section>
    </section>
  )
}

export default Viewticket