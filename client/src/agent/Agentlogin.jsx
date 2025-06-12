import React,{useState} from 'react'
import banner1 from "assets/banner1.jpg"
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
const Agentlogin = () => {
    const [phone,setphone]=useState("");
   const [password,setpassword]=useState("");
    const [errortext,seterrortext]=useState("");
    const navigate=useNavigate();

    const handleform=(e)=>{
       e.preventDefault();
       if(phone=="" || password==""){
                seterrortext("Please fill up your information!")
       }else if(!phone=="" || !password==""){
                axios.post(`${process.env.REACT_APP_BASE_URL2}/agent-login`,{phone,password})
                .then((res)=>{
                    if(res.data.success==true){
                        toast.success("Login Successful 🎉🎉");
                        localStorage.setItem("agent_info",JSON.stringify(res.data.agent_info))
                       if(res.data.agent_info.status=="deactivated"){
                         setTimeout(() => {
                         navigate("/agent/waiting-for-approval")
                        }, 1000);
                       }else if(res.data.agent_info.status=="activated"){
                        setTimeout(() => {
                         navigate("/agent-dashboard")
                        }, 1000);
                       }
                    }else{
                           toast.error(res.data.message)
                    }
                }).catch((err)=>{
                    toast.error(err.name)
                })
       }
    }
  return (
    <section className='w-full h-[100vh] bg-[#F8F9FD] flex justify-center items-center relative'>
        <section className='w-[100%] h-[100%] flex justify-end items-center '>
            <Toaster/>
            <div className='w-[50%]  pr-[50px] z-[1000]'>
                 <h1 className='text-[40px] font-[600] mb-[20px] text-white'>Sign In</h1>
                 <form action=""onSubmit={handleform}>
                    <div className="mb-[15px]">
                        <label htmlFor=""className='text-[16px] text-white'>Number</label><br />
                        <input type="number"placeholder='Enter agent number'onChange={(e)=>{setphone(e.target.value)}} className='w-full mt-[5px] appearance-none border-[1px] border-[#eee] rounded-[2px] h-[55px] p-[15px] text-[17px] text-neutral-600' />
                    </div>
                    <div className="">
                        <label htmlFor=""className='text-[16px] text-white'>Password</label><br />
                        <input type="password"placeholder='Enter your password'onChange={(e)=>{setpassword(e.target.value)}}className='w-full mt-[5px] border-[1px] border-[#eee] rounded-[2px] h-[55px] p-[15px] text-[17px] text-neutral-600' />
                    </div>
                       <p className='text-[18px] pt-[10px] text-red-600'>{errortext}</p>
                    <button className='w-full h-[55px] bg-[#5B33AD] mt-[20px]  text-[17px] text-white'>Sign In</button>
                 </form>
            </div>
            <div className='w-[100%] h-[100%] absolute top-0 left-0'>
                <img className='w-full h-[100%]' src={banner1} alt="" />
            </div>
        </section>
    </section>
  )
}

export default Agentlogin