import React,{useState,useEffect} from "react";
import { FaSun, FaEye, FaUserCircle } from "react-icons/fa";
import { BiWallet } from "react-icons/bi";
import moment from "moment"
import { MdBalance } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import Swal from 'sweetalert2';
import { FiLogOut } from "react-icons/fi";
import { FaArrowCircleDown } from 'react-icons/fa'; // Import the withdraw icon
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FaRupeeSign, FaDollarSign, FaBitcoin } from "react-icons/fa";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
const Userprofile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("deposit");
  const navigate=useNavigate();
  const [popupContent, setPopupContent] = useState(null); // Manages popup content
   const user_info=JSON.parse(localStorage.getItem("admin_data"));
   
  // logout funtion 
    const logoutfunction=()=>{
        let confirm_box=window.confirm("Are you sure?");
        if(confirm_box){
               localStorage.removeItem("admin_data");
               localStorage.removeItem("token");
               navigate("/merchant-user-login")
        }
    }
    const toggleModal = () => {
    setIsOpen(!isOpen);
    setPopupContent(null); // Reset popup content on close
  };

  const switchTab = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  const openBkashPopup = () => {
    setPopupContent("bkash");
  };

  const openNagadPopup = () => {
    setPopupContent("nagad");
  };
// ------------------user deposit all info
  const [currency, setCurrency] = useState("BDT");
  const [payerId, setPayerId] = useState("");
  const [order_id, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [mid, setMid] = useState("merchant1");
  const [redirect_url, setRedirectUrl] = useState("http://localhost:3000/merchant-website");

  useEffect(() => {
    setOrderId(nanoid(8)); 
    setPayerId(user_info.payer_id);// Generate a unique order ID
  }, []);

  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);
  };

  const handle_bkash_deposit = async () => {
    // Validation logic
    // if (!mid.trim()) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Validation Error",
    //     text: "Merchant ID (mid) is required!",
    //   });
    //   return;
    // }

    // if (!payerId.trim()) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Validation Error",
    //     text: "Payer ID is required!",
    //   });
    //   return;
    // }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter a valid amount!",
      });
      return;
    }

    if (!redirect_url.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Redirect URL is required!",
      });
      return;
    }
    // If all validations pass
    const postData = {mid,payerId,order_id,amount,currency,redirect_url};
    try {
      const {data} = await axios.post(`${process.env.REACT_APP_BASE_URL}/payment/bkash`,{mid,payerId,amount,currency,redirectUrl:redirect_url,orderId:order_id,callbackUrl:"https://admin.eassypay.com/bkash_api"});
      window.location.href = data.link;
      console.log(data)
      if (data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Deposit Successful",
          text: `You have successfully deposited ${amount} ${currency} via BKash.`,
        });
        console.log("Deposit Success:", data.data);
      } else{
        Swal.fire({
          icon: "error",
          title: "Deposit Failed",
          text: data.data.message || "An error occurred while processing your deposit.",
        });
        console.error("Deposit Error:", data.data);
      }
    } catch (error) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Error",
    //     text: error.response?.data?.message || "Failed to connect to the server. Please try again later.",
    //   });
      console.log(error);
    }
  };
  const data = [
    {
      date: "2024-12-03 01:19:34",
      method: "BKASH",
      channel: "Paytaka",
      id: "DRX24120317193488BDT",
      amount: "200.00",
      bonus: "-",
      status: "প্রত্যাখ্যাত",
      memo: "Pending timeout",
    },
    {
      date: "2024-11-21 01:46:15",
      method: "NAGAD",
      channel: "Paytaka",
      id: "DRX24112117461547BDT",
      amount: "200.00",
      bonus: "-",
      status: "প্রত্যাখ্যাত",
      memo: "Incomplete timeout",
    },
    {
      date: "2024-11-20 22:57:49",
      method: "NAGAD",
      channel: "Paytaka",
      id: "DRX2411211457495FBDT",
      amount: "5,000.00",
      bonus: "Live Casino Weekly 20% Deposit Bonus",
      status: "প্রত্যাখ্যাত",
      memo: "Incomplete timeout",
    },
    {
      date: "2024-11-20 21:39:35",
      method: "NAGAD",
      channel: "Paytaka",
      id: "DRX241121133935ACBDT",
      amount: "200.00",
      bonus: "-",
      status: "প্রত্যাখ্যাত",
      memo: "Incomplete timeout",
    },
  ];

// ------------------user deposit all info
const [user_money,setuser_money]=useState([]);
    const user_money_info=()=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/user/user-money-info/${user_info.payer_id}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
        .then((res)=>{
            if(res.data.success){
               setuser_money(res.data.data)
            }
        }).catch((err)=>{
            console.log(err.name)
        })
    };
    useEffect(()=>{
        user_money_info()
    },[])
    const handleWithdraw = () => {
  // Logic for withdrawal
  console.log("Withdraw button clicked!");
  // Optionally, open a modal or navigate to a withdrawal page
};
// -----------------deposit history
const [deposit_money2,setdeposit_money2]=useState([]);
const deposit_history=()=>{
  axios.get(`${process.env.REACT_APP_BASE_URL}/user/user-deposit-history/${user_info.payer_id}`)
  .then((res)=>{
   setdeposit_money2(res.data.data);
   console.log(res.data.data)
  }).catch((err)=>{
    console.log(err)
  })
}
const [withdraw_money,setwithdraw_money]=useState([]);
const withdraw_history=()=>{
  axios.get(`${process.env.REACT_APP_BASE_URL}/user/user-withdraw-history/${user_info.payer_id}`)
  .then((res)=>{
   setwithdraw_money(res.data.data)
   console.log(res.data.data)

   
  }).catch((err)=>{
    console.log(err)
  })
}
useEffect(()=>{
  deposit_history();
  withdraw_history();
},[])
  return (
   <section>
     <div className=" p-6 font-poppins h-auto flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-4">
  <div className="flex items-center gap-2">
    <div className="text-3xl font-bold text-indigo-500">New <span className="text-orange-500">Bet</span></div>
  </div>
  <div className="flex items-center gap-6 text-gray-600">
    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 text-[18px] rounded-lg shadow-sm">
      <span className="font-semibold">Bonus Balance:</span>
      <MdBalance className="w-5 h-5 text-blue-500" />
      <span className="text-gray-800">0 ৳</span>
    </div>
    <div onClick={toggleModal} className="flex items-center gap-2 bg-gray-100 px-3 py-2 text-[18px] rounded-lg shadow-sm">
      <span className="font-semibold">Balance:</span>
      <BiWallet className="w-5 h-5 text-green-500" />
      {user_money?.balance > 0 ? <span className="text-gray-800"> ৳{user_money?.balance}</span> : <span className="text-gray-800">৳ 0</span>}
    </div>
    <NavLink to='/withdraw-form'>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 text-[18px] rounded-lg shadow-sm cursor-pointer" onClick={handleWithdraw}>
      <span className="font-semibold">Withdraw:</span>
      <FaArrowCircleDown className="w-5 h-5 text-red-500" />
      <span className="text-gray-800">Withdraw Funds</span>
    </div>
    </NavLink>

    <div>
      <NavLink to="/p2p-deposit"><button className="w-[150px] h-[40px] bg-[#fed330] rounded-[5px] text-[16px] text-white">P2P Payment</button></NavLink>
    </div>
    <FaUserCircle className="w-8 h-8 text-gray-700" />
    <button onClick={logoutfunction} className="px-[2px] py-[5px] text-[22px] cursor-pointer text-red-600">
      <FiLogOut />
    </button>
  </div>
</div>

      {/* Main Section */}
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4 p-[10px] border-[1px] border-[#eee] rounded-[10px]">
          <div className="flex items-center gap-4 bg-orange-100 p-3 rounded-lg shadow">
            <img
              src="https://xxxbetgames.com/icons-xxx/drawer/bonusCabinet.png"
              alt="Bonus Cabinet"
              className="w-8 h-8"
            />
            <span className="text-gray-800 font-semibold">Bonus Cabinet</span>
          </div>
          <div className="flex items-center gap-4 bg-gray-200 p-3 rounded-lg shadow">
            <img
              src="https://xxxbetgames.com/icons-xxx/drawer/battles.png"
              alt="XXX Battles"
              className="w-8 h-8"
            />
            <span className="text-gray-800 font-semibold">XXX Battles</span>
          </div>
          <div className="flex items-center gap-4 bg-purple-200 p-3 rounded-lg shadow">
            <img
              src="https://xxxbetgames.com/icons-xxx/drawer/vip.png"
              alt="VIP Club"
              className="w-8 h-8"
            />
            <span className="text-gray-800 font-semibold">VIP Club</span>
          </div>
        </div>

        {/* Content */}
        <div className="col-span-3 grid grid-cols-3 gap-6">
          {/* Welcome Bonus */}
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <img
              src="https://xxxbetgames.com/icons-xxx/banners/homeSlider/vip.png"
              alt="Welcome Bonus"
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-xl font-bold mt-3">Welcome Bonus</h3>
            <p className="text-gray-600">125% + 250 FS</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Open
            </button>
          </div>

          {/* Weekly Bonus */}
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <img
              src="https://xxxbetgames.com/icons-xxx/banners/homeSlider/weekly.png"
              alt="Weekly Bonus"
              className="w-full h-40 object-cover rounded-[10px]"
            />
            <h3 className="text-xl font-bold mt-3">Weekly Bonus</h3>
            <p className="text-gray-600">
              Regardless of the result for the week, you will be awarded an
              individual bonus.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Open
            </button>
          </div>

          {/* Elevate Your Status */}
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <img
              src="https://xxxbetgames.com/icons-xxx/banners/homeSlider/weekly.png"
              alt="Elevate Your Status"
              className="w-full h-40 object-cover rounded-[10px]"
            />
            <h3 className="text-xl font-bold mt-3">Elevate Your Status</h3>
            <p className="text-gray-600">
              Achieve new levels and reap the rewards. The higher you ascend,
              the more lucrative the level-ups become.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Play now
            </button>
          </div>
        </div>

       {/* Main Modal */}
      {isOpen && !popupContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-bold text-center mb-4">Wallet</h2>

            {/* Tabs */}
            <div className="flex justify-center mb-6 border-b border-gray-200">
              <button
                className={`px-6 py-2 text-lg font-semibold transition ${
                  activeTab === "deposit"
                    ? "text-yellow-500 border-b-4 border-yellow-500"
                    : "text-gray-600"
                }`}
                onClick={() => switchTab("deposit")}
              >
                Deposit
              </button>
              <button
                className={`px-6 py-2 text-lg font-semibold transition ${
                  activeTab === "withdraw"
                    ? "text-yellow-500 border-b-4 border-yellow-500"
                    : "text-gray-600"
                }`}
                onClick={() => switchTab("withdraw")}
              >
                Withdraw
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "deposit" && (
              <div>
                <p className="text-gray-600 mb-4">
                  Please choose a method to deposit funds:
                </p>
                <div className="flex justify-between gap-4">
                  <div
                    className="flex-1 flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200"
                    onClick={openBkashPopup}
                  >
                    <img
                      src="https://xxxbetgames.com/icons-xxx/payments/70.svg"
                      alt="Bkash"
                      className="w-16 h-16 mb-2"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      BKASH
                    </span>
                    <span className="text-xs text-red-500 font-bold">DEPOSIT</span>
                  </div>
                  <div
                    className="flex-1 flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200"
                    onClick={openNagadPopup}
                  >
                    <img
                      src="https://xxxbetgames.com/icons-xxx/payments/89.svg"
                      alt="Nagad"
                      className="w-16 h-16 mb-2"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      NAGAD
                    </span>
                    <span className="text-xs text-red-500 font-bold">DEPOSIT</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "withdraw" && (
              <div>
                <p className="text-gray-600 mb-4">
                  Please choose a method to withdraw funds:
                </p>
                <div className="flex justify-between gap-4">
                  <div
                    className="flex-1 flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200"
                    onClick={openBkashPopup}
                  >
                    <img
                      src="https://xxxbetgames.com/icons-xxx/payments/70.svg"
                      alt="Bkash"
                      className="w-16 h-16 mb-2"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      BKASH
                    </span>
                    <span className="text-xs text-red-500 font-bold">
                      WITHDRAW
                    </span>
                  </div>
                  <div
                    className="flex-1 flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200"
                    onClick={openNagadPopup}
                  >
                    <img
                      src="https://xxxbetgames.com/icons-xxx/payments/89.svg"
                      alt="Nagad"
                      className="w-16 h-16 mb-2"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      NAGAD
                    </span>
                    <span className="text-xs text-red-500 font-bold">
                      WITHDRAW
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup Content */}
      {isOpen && popupContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setPopupContent(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-blue-500"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Bkash and Nagad Popups */}
            {popupContent === "bkash" && activeTab === "deposit" && (
            
           <div className="bg-white p-6">


      <img
        src="https://xxxbetgames.com/icons-xxx/payments/70.svg"
        alt="Bkash Logo"
        className="w-20 h-20 mx-auto mb-4"
      />

      <h3 className="text-center text-xl font-semibold text-red-500">
        BKASH DEPOSIT
      </h3>

      <p className="text-center text-gray-600 mt-2">Enter your deposit amount:</p>

      <div className="mt-4">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Currency Selection */}
      <div className="mt-6">
        <h3 className="text-gray-700 text-lg font-semibold mb-2">Select Currency:</h3>
        <div className="flex justify-between gap-4">
          <div
            onClick={() => handleCurrencyChange("BDT")}
            className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
              currency === "BDT" ? "bg-yellow-100 border-yellow-400" : "bg-gray-100 border-gray-300"
            }`}
          >
            <FaRupeeSign className="text-yellow-500 text-xl" />
            <span className="font-semibold text-gray-700">BDT</span>
          </div>
          <div
            onClick={() => handleCurrencyChange("INR")}
            className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
              currency === "INR" ? "bg-green-100 border-green-400" : "bg-gray-100 border-gray-300"
            }`}
          >
            <FaRupeeSign className="text-green-500 text-xl" />
            <span className="font-semibold text-gray-700">INR</span>
          </div>
          <div
            onClick={() => handleCurrencyChange("USDT")}
            className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
              currency === "USDT" ? "bg-blue-100 border-blue-400" : "bg-gray-100 border-gray-300"
            }`}
          >
            <FaBitcoin className="text-blue-500 text-xl" />
            <span className="font-semibold text-gray-700">USDT</span>
          </div>
        </div>
      </div>

      <button onClick={handle_bkash_deposit} className="w-full bg-yellow-500 text-white py-3 rounded-lg mt-6">
        Confirm Deposit
      </button>
    </div>
            )}
         {/* -------------------bkash withdraw----------------------- */}
            {popupContent === "bkash" && activeTab === "withdraw" && (
              <div>
                <img
                  src="https://xxxbetgames.com/icons-xxx/payments/70.svg"
                  alt="Bkash Logo"
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="text-center text-xl font-semibold text-red-500">
                  BKASH WITHDRAW
                </h3>
                <p className="text-center text-gray-600 mt-2">
                  Enter your withdrawal amount:
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Amount"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <button className="w-full bg-yellow-500 text-white py-3 rounded-lg mt-6">
                  Confirm Withdraw
                </button>
              </div>
            )}
         {/* -------------------nagad withdraw----------------------- */}
            {popupContent === "nagad" && activeTab === "deposit" && (
              <div>
                <img
                  src="https://xxxbetgames.com/icons-xxx/payments/89.svg"
                  alt="Nagad Logo"
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="text-center text-xl font-semibold text-red-500">
                  NAGAD DEPOSIT
                </h3>
                <p className="text-center text-gray-600 mt-2">
                  Enter your deposit amount:
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Amount"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <button className="w-full bg-yellow-500 text-white py-3 rounded-lg mt-6">
                  Confirm Deposit
                </button>
              </div>
            )}

            {popupContent === "nagad" && activeTab === "withdraw" && (
              <div>
                <img
                  src="https://xxxbetgames.com/icons-xxx/payments/89.svg"
                  alt="Nagad Logo"
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="text-center text-xl font-semibold text-red-500">
                  NAGAD WITHDRAW
                </h3>
                <p className="text-center text-gray-600 mt-2">
                  Enter your withdrawal amount:
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Amount"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <button className="w-full bg-yellow-500 text-white py-3 rounded-lg mt-6">
                  Confirm Withdraw
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
      
    </div>
    {/* -------------------transiction history---------------------- */}
    <section className="p-[30px]">
        <h1 className="text-[22px] font-[500] mb-[30px]">Deposit History</h1>
        {/* ---------------history------------ */}
<div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Deposit Method</th>
            <th className="border px-4 py-2">Deposit ID</th>
            <th className="border px-4 py-2">Deposit Amount</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {deposit_money2.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{moment(item?.createdAt).fromNow()}</td>
              <td className="border px-4 py-2">{item.provider}</td>
              <td className="border px-4 py-2">
                <div className="flex items-center space-x-2">
                  <span>{item.orderId}</span>
                  <button className="bg-gray-200 px-2 py-1 rounded text-sm">
                    Copy
                  </button>
                </div>
              </td>
              <td className="border px-4 py-2">৳ {item.expectedAmount}</td>
            {
              data.status=="fully paid" ?<td className="border px-4 py-2 text-green-500">{item.status}</td>:""
            }
                   {
              data.status=="pending" ?<td className="border px-4 py-2 text-orange-500">{item.status}</td>:""
            }
                        {
              data.status=="suspended" ?<td className="border px-4 py-2 text-red-600">{item.status}</td>:<td className="border px-4 py-2 text-green-700">{item.status}</td>
            }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </section>
       <section className="p-[30px]">
        <h1 className="text-[22px] font-[500] mb-[30px]">Withdraw History</h1>
        {/* ---------------history------------ */}
<div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Withdraw Method</th>
            <th className="border px-4 py-2">Withdraw ID</th>
            <th className="border px-4 py-2">Withdraw Amount</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {withdraw_money.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{moment(item?.createdAt).fromNow()}</td>
              <td className="border px-4 py-2">{item.provider}</td>
              <td className="border px-4 py-2">
                <div className="flex items-center space-x-2">
                  <span>{item.orderId}</span>
                  <button className="bg-gray-200 px-2 py-1 rounded text-sm">
                    Copy
                  </button>
                </div>
              </td>
              <td className="border px-4 py-2">৳ {item.requestAmount}</td>
            {
              data.status=="assigned" ?<td className="border px-4 py-2 text-green-500">{item.status}</td>:""
            }        {
              data.status=="rejected" ?<td className="border px-4 py-2 text-red-600">{item.status}</td>:<td className="border px-4 py-2 text-orange-700">{item.status}</td>
            }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </section>
    {/* -------------------transiction history---------------------- */}
   </section>
  );
};

export default Userprofile;
