import React, { useContext, useEffect,useState } from 'react'
import { PiWechatLogoFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa6";
import { HiOutlineMenu } from "react-icons/hi";
import { RxEnterFullScreen } from "react-icons/rx";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FaUserFriends } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
import { CgMenuLeftAlt } from "react-icons/cg";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { FaUserLarge } from "react-icons/fa6";
import Swal from 'sweetalert2';
import { AiOutlineSearch } from "react-icons/ai";
import { Contextapi } from '../../context/Appcontext';
import { PiCurrencyDollarBold } from "react-icons/pi";
import wallet_img from "../../assets/wallet.png"
import { BiSolidBellRing } from "react-icons/bi";
import { LuMessagesSquare } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";
import { CgClose } from "react-icons/cg";
import { BsCheckCircle, BsDot } from "react-icons/bs";
import { MdOutlineDesignServices, MdOutlineDashboard } from "react-icons/md";
import { AiOutlineFileAdd, AiOutlineFileDone } from "react-icons/ai";
import { FiPackage } from "react-icons/fi";
import { BiTask } from "react-icons/bi";
import axios from "axios"
const EnglishToBanglaNumber = (number) => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return number.toString().split('').map(digit => 
    isNaN(digit) ? digit : banglaDigits[digit]
  ).join('');
};

const Dashboradheader = ()=> {
  const navigate=useNavigate();
    const {activesidebar,setactivesidebar,activetopbar,setactivetopbar}=useContext(Contextapi);
    function handlesidebar(){
        setactivesidebar(!activesidebar)
    }
    const agent_info=JSON.parse(localStorage.getItem("agent_info"));
   const [total_amount_of_deposit,settotal_amount_of_deposit]=useState([]);
    useEffect(()=>{
       function agent_depositinfo(){
        axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-deposit/${agent_info._id}`)
        .then((res)=>{
          settotal_amount_of_deposit(res.data.agent_information);
          console.log(res.data.agent_information)
        }).catch((err)=>{
          console.log(err)
        })
       }
       agent_depositinfo();
       console.log(total_amount_of_deposit)
    },[]);
    const [activenotification,setnotification]=useState(false)
    // --------active profile dropdown
    const [profile_dropdown,setprofile_dropdown]=useState(false)
    // --------------settign sidebar
    const [filter_sidebar,setfilter_sidebar]=useState(false)
    const [filter_sidebar2,setfilter_sidebar2]=useState(false)
    const [filter_sidebar3,setfilter_sidebar3]=useState(false);
  const balanceInBangla = EnglishToBanglaNumber(total_amount_of_deposit?.balance_in_bdt || 0);
     const activities = [
    {
      id: 1,
      icon: <MdOutlineDesignServices className="text-gray-500" size={24} />,
      title: "Invitation for crafting engaging designs",
      time: "2 years",
      status: "unread",
    },
    {
      id: 2,
      icon: <MdOutlineDashboard className="text-gray-500" size={24} />,
      title: "Isomorphic dashboard redesign",
      time: "2 years",
      status: "unread",
    },
    {
      id: 3,
      icon: <AiOutlineFileAdd className="text-gray-500" size={24} />,
      title: "3 New Incoming Project Files:",
      time: "2 years",
      status: "read",
    },
    {
      id: 4,
      icon: <FiPackage className="text-gray-500" size={24} />,
      title: "Swornak purchased isomorphic",
      time: "2 years",
      status: "read",
    },
    {
      id: 5,
      icon: <BiTask className="text-gray-500" size={24} />,
      title: "Task #45890 merged with #45890 in “Ad…”",
      time: "2 years",
      status: "unread",
    },
    {
      id: 6,
      icon: <AiOutlineFileDone className="text-gray-500" size={24} />,
      title: "3 new application design concepts added",
      time: "2 years",
      status: "unread",
    },
    {
      id: 7,
      icon: <FiPackage className="text-gray-500" size={24} />,
      title: "Your order has been placed",
      time: "2 years",
      status: "read",
    },
  ];

      // logout funtion 

const logoutfunction = () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log out!',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("agent_info");
            localStorage.removeItem("token");
            navigate("/");
        }
    });
}

  return (
    <header className='w-full font-poppins sticky z-[444] bg-[#3366FF] top-0 left-0  h-[12vh] xl:h-[10vh] px-[20px] md:px-[30px] py-[10px] border-b-[1px] border-[#eee] shadow-sm flex justify-between items-center'>
       <div className='w-full flex justify-between  items-center gap-[20px]'>
         <div className="cursor-pointer text-[28px]">
           <CgMenuLeftAlt className='lg:hidden 'onClick={handlesidebar}/>
        </div>
        {/* <div className='flex justify-center items-center gap-[10px]'>
                 <div className='flex justify-center items-center gap-[10px]'>
                  <h2 className='text-[17px] lg:text-[20px] font-[600]'>{agent_info.name}</h2>
                     <div className='hidden bg-[#FFCE01] cursor-pointer h-[6vh] lg:flex justify-center items-center  rounded-[3px] p-[10px]'>
                            <FaUser className='text-[22px]'/>
                     </div>
                 </div>
      
          <NavLink to="/agent-deposit-page">
             <div className='bg-[#FFCE01] text-white h-[6vh]  cursor-pointer flex justify-center items-center rounded-[3px] p-[10px]'>
                <img className='w-[30px]' src={wallet_img} alt="" />
           </div>
          </NavLink>
    
        
        </div> */}
          {/* -------------menu---------------------- */}
           <div className='flex justify-center items-center gap-[10px] lg:gap-[15px] '>
                <div className='hidden lg:block bg-white  border-[1px] border-[#eee] px-[12px] lg:px-[14px] py-[8px] rounded-[4px]'>
            <div>
              <h2 className='lg:flex justify-start hidden items-center gap-[10px] cursor-pointer text-black text-[17px] lg:text-[20px] font-[500]'>
                <FaBangladeshiTakaSign/>:
                <span className="font-[600]">{balanceInBangla}</span>
              </h2>
            </div>
          </div>
            {/* <div onClick={()=>{setfilter_sidebar3(true)}} className='p-[10px] rounded-[4px] border-[1px] relative  border-[#eee] shadow-sm text-[20px] cursor-pointer'>
               <BiSolidBellRing/>
            </div> */}
                {/* <div onClick={()=>{setfilter_sidebar2(true)}}  className='p-[10px] rounded-[4px] border-[1px] border-[#eee] shadow-sm text-[20px] cursor-pointer'>
               <LuMessagesSquare/>
            </div> */}
               <NavLink to="/agent-deposit-page">
                 <div className='p-[10px] rounded-[4px] bg-white border-[1px] border-[#eee] shadow-sm text-[20px] cursor-pointer'>
                      <LuWallet/>
                 </div>
               </NavLink>
            <div className='relative'>
              <img onClick={()=>{setprofile_dropdown(!profile_dropdown)}} className='w-[40px] bg-white border-[1px] border-indigo-500 p-[3px] cursor-pointer h-[40px] rounded-full' src={`https://robohash.org/${agent_info?.name}.png`} alt="" />
         {/*------------------- profile dropdown-------------- */}
    <div className={profile_dropdown ? "absolute top-[120%] font-poppins bg-white border-[1px] border-[#eee] rounded-[5px] right-0 w-max mx-auto" : "absolute top-[120%] font-poppins bg-white border-[1px] border-[#eee] rounded-[5px] right-0 hidden w-max mx-auto"}>
  <div className="p-[10px] flex items-center gap-3">
    <img
      src={`https://robohash.org/${agent_info?.name}.png`}
      alt="User Avatar"
      className="w-10 h-10 rounded-full object-cover"
    />
    <div>
           <h2 className='flex justify-start items-center lg:hidden gap-[10px] cursor-pointer text-black text-[13px] lg:text-[20px] font-[500]'>
                <FaBangladeshiTakaSign/>:
                <span className="font-[600]">{balanceInBangla}</span>
              </h2>
      <h2 className="text-[12px] lg:text-[14px] font-[500]">{agent_info?.name}</h2>
      <p className="text-[11px] lg:text-[13px] text-gray-600">{agent_info?.email}</p>
    </div>
  </div>
  <ul id="dropdownMenu" className="block shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded-lg max-h-96 overflow-auto">
  <NavLink to="/agent-profile">
        <li className="py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 mr-3" viewBox="0 0 512 512">
        <path d="M337.711 241.3a16 16 0 0 0-11.461 3.988c-18.739 16.561-43.688 25.682-70.25 25.682s-51.511-9.121-70.25-25.683a16.007 16.007 0 0 0-11.461-3.988c-78.926 4.274-140.752 63.672-140.752 135.224v107.152C33.537 499.293 46.9 512 63.332 512h385.336c16.429 0 29.8-12.707 29.8-28.325V376.523c-.005-71.552-61.831-130.95-140.757-135.223zM446.463 480H65.537V376.523c0-52.739 45.359-96.888 104.351-102.8C193.75 292.63 224.055 302.97 256 302.97s62.25-10.34 86.112-29.245c58.992 5.91 104.351 50.059 104.351 102.8zM256 234.375a117.188 117.188 0 1 0-117.188-117.187A117.32 117.32 0 0 0 256 234.375zM256 32a85.188 85.188 0 1 1-85.188 85.188A85.284 85.284 0 0 1 256 32z" />
      </svg>
      My Profile
    </li>
  </NavLink>
    <li className="py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 mr-3" viewBox="0 0 512 512">
        <path d="M197.332 170.668h-160C16.746 170.668 0 153.922 0 133.332v-96C0 16.746 16.746 0 37.332 0h160c20.59 0 37.336 16.746 37.336 37.332v96c0 20.59-16.746 37.336-37.336 37.336zM37.332 32A5.336 5.336 0 0 0 32 37.332v96a5.337 5.337 0 0 0 5.332 5.336h160a5.338 5.338 0 0 0 5.336-5.336v-96A5.337 5.337 0 0 0 197.332 32zm160 480h-160C16.746 512 0 495.254 0 474.668v-224c0-20.59 16.746-37.336 37.332-37.336h160c20.59 0 37.336 16.746 37.336 37.336v224c0 20.586-16.746 37.332-37.336 37.332zm-160-266.668A5.337 5.337 0 0 0 32 250.668v224A5.336 5.336 0 0 0 37.332 480h160a5.337 5.337 0 0 0 5.336-5.332v-224a5.338 5.338 0 0 0-5.336-5.336zM474.668 512h-160c-20.59 0-37.336-16.746-37.336-37.332v-96c0-20.59 16.746-37.336 37.336-37.336h160c20.586 0 37.332 16.746 37.332 37.336v96C512 495.254 495.254 512 474.668 512zm-160-138.668a5.338 5.338 0 0 0-5.336 5.336v96a5.337 5.337 0 0 0 5.336 5.332h160a5.336 5.336 0 0 0 5.332-5.332v-96a5.337 5.337 0 0 0-5.332-5.336zm160-74.664h-160c-20.59 0-37.336-16.746-37.336-37.336v-224C277.332 16.746 294.078 0 314.668 0h160C495.254 0 512 16.746 512 37.332v224c0 20.59-16.746 37.336-37.332 37.336zM314.668 32a5.337 5.337 0 0 0-5.336 5.332v224a5.338 5.338 0 0 0 5.336 5.336h160a5.337 5.337 0 0 0 5.332-5.336v-224A5.336 5.336 0 0 0 474.668 32zm0 0" />
      </svg>
      Account Settings
    </li>
    <li onClick={logoutfunction} className="py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 mr-3" viewBox="0 0 6.35 6.35">
        <path d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z" />
      </svg>
      Logout
    </li>
  </ul>
</div>
         {/* -------------------notification bar------------ */}
         <section className={filter_sidebar3 ?  'fixed top-0 right-0   flex justify-end w-full h-[100%] z-[1099900000]':'fixed top-0 right-[-130%]  flex justify-end w-full h-[100%] z-[1099900000]'}>
              <div className='w-[100%] md:w-[100%] bg-[rgba(0,0,0,0.3)] xl:w-[100%] 2xl:w-[100%] h-[100vh]' onClick={()=>{setfilter_sidebar3(false)}}>

              </div>
             <div
  className={`${
    filter_sidebar3
      ? "w-[90%] sm:w-[70%] md:w-[60%] lg:w-[45%] xl:w-[35%] 2xl:w-[25%] transition-all absolute top-0 right-0 duration-200 h-[100vh] bg-white overflow-y-auto shadow-2xl no-scrollbar border-l border-[#eee]"
      : "w-[90%] sm:w-[70%] md:w-[60%] lg:w-[45%] xl:w-[35%] 2xl:w-[25%] transition-all absolute top-0 right-[-120%] duration-200 h-[100vh] bg-white overflow-y-auto shadow-2xl no-scrollbar border-l border-[#eee]"
  }`}
>
     {/* Header */}
      <div className="p-4 border-b border-[#eee] flex justify-between items-center">
        <h1 className="text-[16px] md:text-[18px] font-[600] text-black">
          Recent Activities
        </h1>
            <button
      onClick={() => setfilter_sidebar3(false)}
      className="cursor-pointer text-[20px]"
    >
      <CgClose />
    </button>
      </div>

      {/* Activity List */}
      <div className="p-4 space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-2 hover:bg-gray-50 rounded-lg"
          >
            {/* Icon */}
            <div>{activity.icon}</div>
            {/* Details */}
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-800">
                {activity.title}
              </h2>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
            {/* Status Indicator */}
            <div>
              {activity.status === "unread" ? (
                <BsDot size={24} className="text-blue-500" />
              ) : (
                <BsCheckCircle size={18} className="text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="w-full p-4 border-t border-[#eee] flex items-center justify-center">
        <button className="text-blue-600 text-sm font-semibold">
          View All Activity
        </button>
      </div>
    

          </div>

        </section>
        {/* --------------notification bar-------------- */}
        {/* -------------------setting bar------------ */}
         <section className={filter_sidebar ?  'fixed top-0 right-0   flex justify-end w-full h-[100%] z-[1099900000]':'fixed top-0 right-[-130%]  flex justify-end w-full h-[100%] z-[1099900000]'}>
              <div className='w-[100%] md:w-[100%] bg-[rgba(0,0,0,0.3)] xl:w-[100%] 2xl:w-[100%] h-[100vh]' onClick={()=>{setfilter_sidebar(false)}}>

              </div>
             <div
  className={`${
    filter_sidebar
      ? "w-[90%] sm:w-[70%] md:w-[60%] lg:w-[45%] xl:w-[35%] 2xl:w-[25%] transition-all absolute top-0 right-0 duration-200 h-[100vh] bg-white overflow-y-auto shadow-2xl no-scrollbar border-l border-[#eee]"
      : "w-[90%] sm:w-[70%] md:w-[60%] lg:w-[45%] xl:w-[35%] 2xl:w-[25%] transition-all absolute top-0 right-[-120%] duration-200 h-[100vh] bg-white overflow-y-auto shadow-2xl no-scrollbar border-l border-[#eee]"
  }`}
>
  {/* Header */}
  <div className="p-[20px] border-b border-[#eee] flex justify-between items-center">
    <h1 className="text-[16px] md:text-[18px] font-[600] text-black">Settings</h1>
    <button
      onClick={() => setfilter_sidebar(false)}
      className="cursor-pointer text-[20px]"
    >
      <CgClose />
    </button>
  </div>

  {/* Appearance Section */}
  <div className="p-4 md:p-6">
    <h2 className="text-[14px] font-[600] text-[#888] mb-4">APPEARANCE</h2>
    <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4">
      <div className="border-2 border-blue-500 rounded-lg p-4 flex-1 cursor-pointer">
        <div className="bg-gray-100 h-[50px] rounded-md mb-2 flex items-center justify-center">
          <span className="text-black font-bold text-[18px]">Aa</span>
        </div>
        <p className="text-center text-blue-500 text-[12px]">Light</p>
      </div>
      <div className="border-2 border-[#ddd] rounded-lg p-4 flex-1 cursor-pointer">
        <div className="bg-black h-[50px] rounded-md mb-2 flex items-center justify-center">
          <span className="text-white font-bold text-[18px]">Aa</span>
        </div>
        <p className="text-center text-[#888] text-[12px]">Dark</p>
      </div>
    </div>
  </div>

  {/* Direction Section */}
  <div className="p-4 md:p-6">
    <h2 className="text-[14px] font-[600] text-[#888] mb-4">DIRECTION</h2>
    <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4">
      <div className="border-2 border-blue-500 rounded-lg p-4 flex-1 cursor-pointer flex items-center justify-center">
        <p className="text-blue-500 text-[14px]">LTR</p>
      </div>
      <div className="border-2 border-[#ddd] rounded-lg p-4 flex-1 cursor-pointer flex items-center justify-center">
        <p className="text-[#888] text-[14px]">RTL</p>
      </div>
    </div>
  </div>

  {/* Layout Section */}
  <div className="p-4 md:p-6">
    <h2 className="text-[14px] font-[600] text-[#888] mb-4">LAYOUT</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* Hydrogen */}
      <div className="border-2 border-blue-500 rounded-lg p-4 cursor-pointer">
        <div className="bg-gray-200 h-[50px] rounded-md mb-2"></div>
        <p className="text-center text-blue-500 text-[12px]">Hydrogen</p>
      </div>
      {/* Helium */}
      <div className="border-2 border-[#ddd] rounded-lg p-4 cursor-pointer">
        <div className="bg-gray-200 h-[50px] rounded-md mb-2"></div>
        <p className="text-center text-[#888] text-[12px]">Helium</p>
      </div>
      {/* Lithium */}
      <div className="border-2 border-[#ddd] rounded-lg p-4 cursor-pointer">
        <div className="bg-gray-200 h-[50px] rounded-md mb-2"></div>
        <p className="text-center text-[#888] text-[12px]">Lithium</p>
      </div>
    </div>
  </div>

  {/* Footer */}
  <div className="sticky bottom-0 w-[100%] p-4 h-[0vh]  bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.1)] px-[20px]">
    <button className="w-[100%]  bg-blue-500 text-center text-white font-[600] py-2 rounded-lg">
      Purchase for $24
    </button>
  </div>
</div>

        </section>
        {/* --------------setting bar-------------- */}
        
        {/* ----------------message box--------------- */}
         <section className={filter_sidebar2 ?  'fixed top-0 right-0   flex justify-end w-full h-[100%] z-[1099900000]':'fixed top-0 right-[-130%]  flex justify-end w-full h-[100%] z-[1099900000]'}>
              <div   className='w-[100%] md:w-[100%] bg-[rgba(0,0,0,0.3)] xl:w-[100%] 2xl:w-[100%] h-[100vh]' onClick={()=>{setfilter_sidebar2(false)}}>

              </div>
          
              <div className={filter_sidebar2 ? 'w-[80%] md:w-[60%] xl:w-[40%]  transition-all absolute top-0 right-[0%] duration-200 2xl:w-[28%] h-[100vh] bg-white  overflow-y-auto shadow-2xl no-scrollbar border-l-[1px] border-[#eee]':'w-[80%] absolute top-0 right-[-120%] md:w-[60%] xl:w-[40%] 2xl:w-[30%]  transition-all duration-200 h-[100vh] bg-white  overflow-y-auto shadow-2xl no-scrollbar border-l-[1px] border-[#eee]'}>
  {/* Header */}

                     <div className='  p-[20px] border-b-[1px] border-[#eee] flex justify-between items-center'>
                                <h1 className='text-[16px] md:text-[18px] font-[600] text-black'>Messages</h1>
                                <button onClick={()=>{setfilter_sidebar2(false)}} className='cursor-pointer text-[20px]'><CgClose/></button>
                               </div>

  {/* Message List */}
  <div className="p-[10px] space-y-4">
    {/* Message Item 1 */}
    <div className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center space-x-4">
        <img
          src="https://randomuser.me/api/portraits/men/40.jpg"
          alt="Wade Warren"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-[600] text-black text-[14px]">Wade Warren</h2>
          <p className="text-[#888] text-[12px] truncate">It is nice to be chatting with you. Om...</p>
        </div>
      </div>
      <p className="text-[#aaa] text-[12px]">2 years</p>
      <div className="w-[8px] h-[8px] bg-blue-500 rounded-full"></div>
    </div>

    {/* Message Item 2 */}
    <div className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center space-x-3">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Jane Cooper"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-[600] text-black text-[14px]">Jane Cooper</h2>
          <p className="text-[#888] text-[12px] truncate">Oh... Let's move on to something els...</p>
        </div>
      </div>
      <p className="text-[#aaa] text-[12px]">2 years</p>
      <div className="w-[8px] h-[8px] bg-blue-500 rounded-full"></div>
    </div>

    {/* Message Item 3 */}
    <div className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center space-x-3">
        <img
          src="https://randomuser.me/api/portraits/women/47.jpg"
          alt="Leslie Alexander"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-[600] text-black text-[14px]">Leslie Alexander</h2>
          <p className="text-[#888] text-[12px] truncate">You: I never received any phone call...</p>
        </div>
      </div>
      <p className="text-[#aaa] text-[12px]">2 years</p>
      <div className="w-[8px] h-[8px] border border-gray-300 rounded-full"></div>
    </div>

    {/* Message Item 4 */}
    <div className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center space-x-3">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="John Doe"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-[600] text-black text-[14px]">John Doe</h2>
          <p className="text-[#888] text-[12px] truncate">You: But you'll need to type in every...</p>
        </div>
      </div>
      <p className="text-[#aaa] text-[12px]">2 years</p>
      <div className="w-[8px] h-[8px] border border-gray-300 rounded-full"></div>
    </div>

    {/* Message Item 5 */}
    <div className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center space-x-3">
        <img
          src="https://randomuser.me/api/portraits/women/56.jpg"
          alt="Design & Frontend"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-[600] text-black text-[14px]">Design & Frontend</h2>
          <p className="text-[#888] text-[12px] truncate">They were delighted and set to work...</p>
        </div>
      </div>
      <p className="text-[#aaa] text-[12px]">2 years</p>
      <div className="w-[8px] h-[8px] bg-blue-500 rounded-full"></div>
    </div>

    {/* Message Item 6 */}
    <div className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center space-x-3">
        <img
          src="https://randomuser.me/api/portraits/men/12.jpg"
          alt="Laravel"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-[600] text-black text-[14px]">Laravel</h2>
          <p className="text-[#888] text-[12px] truncate">Hows going everything in our laravel...</p>
        </div>
      </div>
      <p className="text-[#aaa] text-[12px]">2 years</p>
      <div className="w-[8px] h-[8px] border border-gray-300 rounded-full"></div>
    </div>

    {/* Message Item 7 */}
    <div className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center space-x-3">
        <img
          src="https://randomuser.me/api/portraits/men/22.jpg"
          alt="WordPress"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-[600] text-black text-[14px]">WordPress</h2>
          <p className="text-[#888] text-[12px] truncate"></p>
        </div>
      </div>
      <p className="text-[#aaa] text-[12px]">2 years</p>
      <div className="w-[8px] h-[8px] border border-gray-300 rounded-full"></div>
    </div>
  </div>
                  </div>
        </section>
        {/* -----------message box------------------ */}

         {/*------------------- profile dropdown-------------- */}
            </div>
           </div>
        {/* -------------menu---------------------- */}
       </div>
  
    </header>
  )
}

export default Dashboradheader