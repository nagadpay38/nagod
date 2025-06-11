import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { TbWorld } from "react-icons/tb";
import { BiGridAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FaMoneyCheck } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5"
import { CgMenuLeftAlt } from "react-icons/cg";
import { TbReportAnalytics } from "react-icons/tb";
import { Contextapi } from 'context/Appcontext';
import { ImTicket } from "react-icons/im";
import { FiSettings } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { TbWallet } from "react-icons/tb";
import { BsBank } from "react-icons/bs";
import { MdOutlineAccountBox } from "react-icons/md";
const Dashboardleftside = () => {
    // const {contactinfo}=useContext(Appcontext);
    const {activesidebar,setactivesidebar}=useContext(Contextapi)
    const [activesubmenu,setactivesubmenu]=useState(false);
    const [activesubmenu2,setactivesubmenu2]=useState(false);
    const [activesubmenu3,setactivesubmenu3]=useState(false);
    const [activesubmenu4,setactivesubmenu4]=useState(false);
    const [activesubmenu5,setactivesubmenu5]=useState(false);
    const [activesubmenu6,setactivesubmenu6]=useState(false);
    const [activesubmenu7,setactivesubmenu7]=useState(false);
    const [activesubmenu8,setactivesubmenu8]=useState(false);
    const [activesubmenu9,setactivesubmenu9]=useState(false);
    const [activesubmenu10,setactivesubmenu10]=useState(false);
    
    const navigate=useNavigate();
    // close sidebar
    function closesidebar(){
        setactivesidebar(false)
    }
    // logout funtion 

        function handlesidebar(){
        setactivesidebar(!activesidebar)
    }
    const agent_info=JSON.parse(localStorage.getItem("agent_info"));
    const handlelogout=()=>{
        const confirm_box=window.confirm("Are you sure?");
        if(confirm_box){
            localStorage.removeItem("agent_info");
            navigate("/login");
        }
    };
  return (
    <>
   <section
  className={
    activesidebar
      ? 'w-[100%] z-[10000] md:block hidden h-[100%]  relative transition-all text-white duration-300 top-0 left-[-10%] bg-gradient-to-b from-indigo-950 to-indigo-900'
      : 'w-[100%] z-[1000] h-[100%] transition-all md:block hidden duration-300  text-white border-gray-200 relative left-0 top-0 overflow-y-auto no-scrollbar bg-gradient-to-b from-indigo-950 to-indigo-900'
  }
> 
  <div className="w-full h-[88vh] overflow-y-auto no-scrollbar px-[30px]">
    <div className="logo w-full h-[10vh] flex justify-end items-center">
      {/* <div className="cursor-pointer text-[28px]"onClick={handlesidebar}>
        <CgMenuLeftAlt/>
      </div> */}
      <h1 className="text-[22px] font-[500] font-sans text-[#0fb9b1]">
        Nagod<span className="">Pay</span>
      </h1>
      {/* <img className='w-[60px] xl:w-[80px] 2xl:w-[100px] xl:scale-[1.8] 2xl:scale-[2.4]' src="https://eassypay.com/wp-content/uploads/2024/07/Eassy-Pay-Logo-Color.webp" alt="" /> */}
    </div>
    <div>
      <ul className="sellerheader pt-[10px] block">
        <li className="mb-[10px]">
          <NavLink
            to="/agent-dashboard"
            className="hover:bg-[#0fb9b1] text-white hover:text-white flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[14px] font-[500]"
          >
            <BiGridAlt className="text-[20px]" />{' '}
            <span className={activesidebar ? 'hidden' : ''}>Dashboard</span>
          </NavLink>
        </li>
        <li className="mb-[10px]">
          <NavLink
            to="/agent-deposit-and-topup"
            className="hover:bg-[#0fb9b1] text-white hover:text-white flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[14px] font-[500]"
          >
            <FaMoneyCheck className="text-[20px]" />{' '}
            <span className={activesidebar ? 'hidden' : ''}>
              Deposit & Topup
            </span>
          </NavLink>
        </li>
        {/* <li className="mb-[10px]">
          <NavLink
            to="/agent-report-and-analize"
            className="hover:bg-[#0fb9b1] text-white hover:text-white flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[14px] font-[500]"
          >
            <TbReportAnalytics className="text-[20px]" />{' '}
            <span className={activesidebar ? 'hidden' : ''}>
              Report & Analize
            </span>
          </NavLink>
        </li> */}
        
              <li className="mb-[10px]">
          <NavLink
            to="/agent-payout"
            className="hover:bg-[#0fb9b1] text-white hover:text-white flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[14px] font-[500]"
          >
            <TbWallet className="text-[20px]" />{' '}
            <span className={activesidebar ? 'hidden' : ''}>
              Pay Out
            </span>
          </NavLink>
        </li>
                      <li className="mb-[10px]">
          <NavLink
            to="/add-bank"
            className="hover:bg-[#0fb9b1] text-white hover:text-white flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[14px] font-[500]"
          >
            <MdOutlineAccountBox className="text-[20px]" />{' '}
            <span className={activesidebar ? 'hidden' : ''}>
             Add Bank
            </span>
          </NavLink>
        </li>
                      <li className="mb-[10px]">
          <NavLink
            to="/bank-account"
            className="hover:bg-[#0fb9b1] text-white hover:text-white flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[14px] font-[500]"
          >
            <BsBank className="text-[20px]" />{' '}
            <span className={activesidebar ? 'hidden' : ''}>
              Bank Account
            </span>
          </NavLink>
        </li>
        <li className="mb-[10px]">
          <NavLink
            to="/agent-create-ticket"
            className="hover:bg-[#0fb9b1] text-white  hover:text-white flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[14px] font-[500]"
          >
            <ImTicket className="text-[20px]" />{' '}
            <span className={activesidebar ? 'hidden' : ''}>Create Ticket</span>
          </NavLink>
        </li>
        <li className="mb-[10px]">
          <NavLink
            to="/agent-profile"
            className="hover:bg-[#0fb9b1]  text-white hover:text-white flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[14px] font-[500]"
          >
            <FiSettings className="text-[20px]" />{' '}
            <span className={activesidebar ? 'hidden' : ''}>Profile</span>
          </NavLink>
        </li>
        <li className="mb-[10px]" onClick={handlelogout}>
          <NavLink
            to=""
            className="hover:bg-[#0fb9b1]  text-white hover:text-white flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[14px] font-[500]"
          >
            <MdLogout className="text-[20px]" />{' '}
            <span className={activesidebar ? 'hidden' : ''}>Log Out</span>
          </NavLink>
        </li>
      </ul>
    </div>
  </div>
</section>

<section
  className={
    activesidebar
      ? 'z-[100000] w-[60%] md:hidden block h-[100%] bg-white fixed transition-all duration-300 shadow-boxshadow5 border-r-[1px] border-[#eee] top-0 left-0'
      : 'z-[100000] w-[100%] h-[100%] transition-all md:hidden block duration-300 bg-white fixed left-[-100%] top-0 shadow-boxshadow5 border-r-[1px] border-[#eee]'
  }
>
  <div
    onClick={closesidebar}
    className="cursor-pointer close absolute top-[10px] right-[30px]"
  >
    <button className="text-[25px] hover:text-[#FF5200] transition-all duration-200">
      <IoClose />
    </button>
  </div>

  <div className='pt-[60px]'>
    <ul className="sellerheader pt-[10px] block">
      <li className="mb-[10px]">
        <NavLink
          to="/agent-dashboard"
          className="hover:bg-[#EEF3FF]  hover:text-[#5D87FF] flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[16px] font-[500]"
        >
          <BiGridAlt className="text-[22px]" />{' '}
          <span>Dashboard</span>
        </NavLink>
      </li>
      <li className="mb-[10px]">
        <NavLink
          to="/agent-deposit-and-topup"
          className="hover:bg-[#EEF3FF] hover:text-[#5D87FF] flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[16px] font-[500]"
        >
          <FaMoneyCheck className="text-[22px]" />{' '}
          <span>Deposit & Topup</span>
        </NavLink>
      </li>
      {/* <li className="mb-[10px]">
        <NavLink
          to="/agent-report-and-analize"
          className="hover:bg-[#EEF3FF]  hover:text-[#5D87FF] flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[16px] font-[500]"
        >
          <TbReportAnalytics className="text-[25px]" />{' '}
          <span>Report & Analize</span>
        </NavLink>
      </li> */}
      <li className="mb-[10px]">
        <NavLink
          to="/agent-create-ticket"
          className="hover:bg-[#EEF3FF]  hover:text-[#5D87FF] flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[16px] font-[500]"
        >
          <ImTicket className="text-[25px]" />{' '}
          <span>Create Ticket</span>
        </NavLink>
      </li>
      <li className="mb-[10px]">
        <NavLink
          to="/agent-profile"
          className="hover:bg-[#EEF3FF]  hover:text-[#5D87FF] flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[16px] font-[500]"
        >
          <FiSettings className="text-[25px]" />{' '}
          <span>Profile</span>
        </NavLink>
      </li>
      <li className="mb-[10px]" onClick={handlelogout}>
        <NavLink
          to=""
          className="hover:bg-[#EEF3FF] hover:text-[#5D87FF] text-gray-800 flex rounded-[6px] justify-start items-center gap-[10px] p-[13px] text-[16px] font-[500]"
        >
          <MdLogout className="text-[25px]" />{' '}
          <span className="text-gray-800">Log Out</span>
        </NavLink>
      </li>
    </ul>
  </div>
</section>

    </>
  )
}

export default Dashboardleftside