import React, { useContext, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Contextapi } from 'context/Appcontext';
import Dashboardleftside from 'components/agentcomponents/Dashboardleftside';
import Dashboradheader from 'components/agentcomponents/Dashboardheader';
import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,PieChart,Pie} from "recharts"
import toast, { Toaster } from 'react-hot-toast';

const Report = () => {
  const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const data02 = [
  { name: 'A1', value: 100 },
  { name: 'A2', value: 300 },
  { name: 'B1', value: 100 },
  { name: 'B2', value: 80 },
  { name: 'B3', value: 40 },
  { name: 'B4', value: 30 },
  { name: 'B5', value: 50 },
  { name: 'C1', value: 100 },
  { name: 'C2', value: 200 },
  { name: 'D1', value: 150 },
  { name: 'D2', value: 50 },
];
   const navigate=useNavigate();
     const {activesidebar,setactivesidebar,activetopbar,setactivetopbar}=useContext(Contextapi);
     const [showmodal,setmodal]=useState(false);
    function handlesidebar(){
        setactivesidebar(!activesidebar)
    }
        useEffect(()=>{
     window.addEventListener("scroll",()=>{
      if(window.scrollY > 100){
             setactivetopbar(true)
      }else{
             setactivetopbar(false)
      }
     })
   },[]);
    function handlesidebar(){
        setactivesidebar(!activesidebar)
    }
    // -------------agent information
    const agent_info=JSON.parse(localStorage.getItem("agent_info"));
    const [agent_deposit_moneyinfo,setagent_deposit_moneyinfo]=useState([]);
   const [total_amount_of_deposit,settotal_amount_of_deposit]=useState();
   const [total_commission,settotal_comission]=useState();
   const [chart_data,setchart_data]=useState([]);
   const [agent_all_info,setagent_all_info]=useState([]);
   const [agent_withdraw_info,set_agent_withdraw_info]=useState([]);
     async function agent_depositinfo(){
        axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-deposit/${agent_info._id}`)
        .then((res)=>{
          setagent_deposit_moneyinfo(res.data.data);
          setagent_all_info(res.data.agent_information);
          set_agent_withdraw_info(res.data.find_agent_withdraw);
          const formattedData = res.data.data.map((transaction) => ({
                    timestamp: new Date(transaction.createdAt).toLocaleDateString(), // Format timestamp
                    amount: transaction.amount,
                }));
                setchart_data(formattedData)
          settotal_amount_of_deposit(res.data.total_amount_of_deposit);
          settotal_comission(res.data.total_commission);
        }).catch((err)=>{
          console.log(err)
        })
       }
    useEffect(()=>{
       agent_depositinfo();
    },[]);


    const [activetab,setactivetab]=useState(1);
    // download excell
    const downloadExcel = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL2}/download-excel/${agent_info._id}`, {
            responseType: 'blob', // Ensure the response is treated as a file
        });
        // Create a Blob from the response
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'data.xlsx';
        link.click();
    } catch (error) {
        console.error('Error downloading the Excel file', error);
    }
};
// delete_deposit_data
const delete_deposit_data=(id)=>{
  const confirm_box=window.confirm("Are you sure?");
    if(confirm_box){
            axios.delete(`${process.env.REACT_APP_BASE_URL2}/agent-deposit-history-delete/${id}`)
    .then((res)=>{
            agent_depositinfo();
            toast.success("Agent has been deleted!");
    }).catch((err)=>{
        console.log(err)
    })
    }
}
  return (
    <section className='w-full h-[100vh] flex font-poppins'>
        <section className={activesidebar ? 'lg:w-[7%] h-[100vh] transition-all duration-300 overflow-hidden':'w-0 md:w-[18%] transition-all duration-300 h-[100vh]'}>
            <Dashboardleftside/>
        </section>
        <section className={activesidebar ? 'w-[100%] lg:w-[93%] h-[100vh] bg-[#EFEFFD] overflow-y-auto transition-all duration-300':' transition-all bg-[#EFEFFD] duration-300 w-[100%] overflow-y-auto md:w-[82%] h-[100vh]'}>
        <Dashboradheader total_amount={total_amount_of_deposit}/> 
        <Toaster/>
       <section className='w-[100%] m-auto py-[20px] xl:py-[40px] px-[10px] lg:px-[20px]'>
        <div>
          <h1 className='text-[30px] font-[500] mb-[8px]'>Report</h1>
          <p className='text-[16px] text-neutral-600'>Whole data about your business here</p>
        </div>
                {/* ----------------------transiction table--------------- */}
                {/* ------------------------------agent chart--------------------- */}
                   <section className='py-[20px] h-auto flex justify-between items-center gap-[20px] bg-white mt-[30px] p-[20px] border-[1px] border-[#eee] border-dashed shadow-md rounded-[5px]'>
                  <section className='w-[100%] h-[500px] pb-[70px] font-red_hat p-[20px] shadow-shadow_box mt-[30px] rounded-[10px] border-[1px] border-[#ebf1f6]'>
                   <div className='pb-[30px] flex justify-between items-center'>
                    <h1 className='text-[18px] font-[500]'>Total Deposit</h1>
                    <h1 className='font-[700] text-[20px] font-space'>৳ {agent_all_info.balance_in_bdt}</h1>
                   </div>
               <ResponsiveContainer width="100%" h="100%">
               <AreaChart className='w-[100%]' data={chart_data}>
                    <YAxis/>
                    <XAxis dataKey="timestamp"/>
                    <CartesianGrid/>
                    <Tooltip/>
                    <Legend/>
                    <Area
                     dataKey="amount" 
                     type="monotone"
                     stroke="#7c3aed"
                     fill="#fed330"
                     />
                    </AreaChart>
               </ResponsiveContainer>
                  </section>
                  {/* <section className='w-[40%] h-[500px] p-[20px] shadow-shadow_box mt-[30px] rounded-[10px] border-[1px] border-[#ebf1f6]'>
                 <div className='flex justify-between items-center '>
                   <h1 className='text-[18px] font-[500]'>Total Share</h1>
                   <h2 className='font-[700] text-[20px] font-space'>৳ 0</h2>
                 </div>
                  <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data01} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#4b7bec" />
          <Pie data={data02} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#4b7bec" label color='#3867d6'/>
        </PieChart>
      </ResponsiveContainer>
                  </section> */}
                 
                   </section>
       </section>
        </section>
    </section>
  )
}

export default Report