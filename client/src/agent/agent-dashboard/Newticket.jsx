import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import { LuPlus } from "react-icons/lu";
import { NavLink, useNavigate } from 'react-router-dom';
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

const Newticket = () => {
   const navigate=useNavigate();
       const agent_info=JSON.parse(localStorage.getItem("agent_info"));
     const {activesidebar,setactivesidebar,activetopbar,setactivetopbar}=useContext(Contextapi);
     const [showmodal,setmodal]=useState(false);
     const [copynumber,setcopynumber]=useState("01688494105")
 const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [ticket_id,setticket_id]=useState("");
  const [name,set_name]=useState("");
  const [email,set_email]=useState("");
    const [supportOption, setSupportOption] = useState('');
  useEffect(() => {
 const generateNumericId = () => {
  const nanoid = customAlphabet('1234567890', 5);// Only numbers, length 10
  return nanoid();
};

setticket_id(generateNumericId());
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) {
      Swal.fire('Validation Error', 'Message cannot be empty.', 'error');
      return;
    }
    else if(!message==""){
 axios.post(`${process.env.REACT_APP_BASE_URL2}/agent-ticket`, {name,email,message,ticket_id,supportOption,agent_id:agent_info._id,role:"agent"})
 .then((res)=>{
  setMessage("");
  set_name("");
  set_email("");
  setSupportOption("")
   Swal.fire({
          icon: 'success',
          title: 'Ticket',
          text:res.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
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
 <div className="">
      <form onSubmit={handleSubmit} className="w-full h-auto bg-white border-[1px] border-[#eee] rounded-[5px] p-[15px]">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Ticket ID <span className="text-blue-500">#{ticket_id}</span>
        </h1>
        {/* <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded border border-yellow-300">
          This ticket is closed. You may reply to this ticket to reopen it.
        </div> */}

        <div className="mb-6 border rounded-lg overflow-hidden">
          <div className="bg-blue-50 p-4 flex items-center border-b">
            <span className="text-lg font-semibold">Create Ticket</span>
          </div>

          <div className="p-4">
         <div className='flex mb-[15px] justify-center items-center gap-[15px]'>
               <div className=" w-[100%] lg:w-[50%]">
              <label className="block text-[16px] font-medium text-gray-700">Name</label>
              <input type="text"value={name} onChange={(e)=>{set_name(e.target.value)}} className="w-full h-[45px] mt-[10px] border-[1px] border-[#eee] rounded-[5px]" />
            </div>

            <div className=" w-[100%] lg:w-[50%]">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email"value={email} onChange={(e)=>{set_email(e.target.value)}} className="w-full h-[45px] mt-[10px] border-[1px] border-[#eee] rounded-[5px]"/>
            </div>
         </div>
    <div className=" w-[100%] mt-[15px] mb-[15px]">
              <label className="block text-[16px] font-medium text-gray-700">Select Support</label>
                 <select
            className="w-full h-[45px] mt-[10px] px-[15px] text-[17px] border-[1px] border-[#eee] rounded-[5px]"
            value={supportOption}
            onChange={(e) => setSupportOption(e.target.value)}
          >
            <option value="">Select Support Option</option>
            <option value="technical">Technical Support</option>
            <option value="billing">Billing Support</option>
            <option value="general">General Inquiry</option>
          </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                className="mt-1 p-2 w-full border-[1px] border-[#eee] rounded-md h-40"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Attachments</label>
              <input 
                type="file" 
                className="mt-1 p-2 w-full border-[1px] border-[#eee] rounded-md" 
                onChange={(e) => setFile(e.target.files[0])} 
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button 
                className="bg-indigo-500 text-white px-[30px] py-[14px] rounded-md hover:bg-blue-600 " 
              >
                Submit
              </button>
              <button className="bg-gray-300 text-gray-800 px-[30px] py-[14px] rounded-md hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>


      </form>
    </div>                                
       </section>
        </section>
    </section>
  )
}

export default Newticket