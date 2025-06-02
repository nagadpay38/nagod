import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
  Paper,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";

// Custom styles
import useStyles from "./styles";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
// Assets
import logo from "./easypay-logo.png";
import bg_img from "../../assets/banner2.jpeg"
// Context for authentication
import { AuthContext, AuthProvider } from "../../context/AuthContext";

function Login() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { login, register,authUser} = useContext(AuthContext);
  const { isAuthenticated } = new AuthProvider();

  // Local state for form handling and UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeTabId, setActiveTabId] = useState(0);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  // useEffect(() => {
  //   // Check if the user is already authenticated
  //   // Implement this function to check auth state
  //   if (isAuthenticated()) {
  //     console.log(isAuthenticated());
  //     navigate("/dashboard");
  //   }
  // }, [navigate, isAuthenticated]);

  /**
   * Switches between Login and Register tabs
   * @param {number} id - Tab ID to set as active
   */
  const handleChangeTab = (id) => {
    setActiveTabId(id);
    setErrorMessage(null); // Clear error message when switching tabs
  };

  /**
   * Handles the Login functionality
   * Authenticates user and redirects to dashboard on success
   */
  const handleLogin = async () => {
    console.log("Attempting to log in with:", emailValue, passwordValue);
    const isLoggedIn = await login(
      emailValue,
      passwordValue,
      setIsLoading,
      setErrorMessage
    );
    console.log("Login successful:", isLoggedIn);
    if (isLoggedIn) {
      console.log("Navigating to dashboard");
      navigate("/dashboard");
    } else {
      console.log("Login failed");
    }
  };

  /**
   * Handles the Register functionality
   * Registers a new user and switches back to Login tab on success
   */
  console.log("hlleo",authUser)
  const handleRegister = async () => {
    const isRegistered = await register(
      emailValue,
      nameValue,
      passwordValue,
      setIsLoading,
      setErrorMessage
    );
    if (isRegistered) {
      setActiveTabId(0); // Switch to login tab after successful registration
    }
  };
  // ----------agent login system
    const [phone,setphone]=useState("");
   const [password,setpassword]=useState("");
    const [errortext,seterrortext]=useState("");
    const handleform=(e)=>{
       e.preventDefault();
       if(phone=="" || password==""){
                seterrortext("Please fill up your information!")
       }else if(!phone=="" || !password==""){
                axios.post(`${process.env.REACT_APP_BASE_URL2}/agent-login`,{phone,password})
                .then((res)=>{
                    if(res.data.success==true){
                        toast.success("Login Successful 🎉🎉");
                        localStorage.setItem('token',JSON.stringify(res.data.jwtToken) );
                        localStorage.setItem("agent_info",JSON.stringify(res.data.agent_info));
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
<section className="relative h-screen overflow-hidden bg-gray-900">
  {/* Background Image */}
  <img src={bg_img} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
  <Toaster />

  {/* Overlay with Form */}
  <div className="absolute inset-0 flex items-center justify-center p-4">
    <div className="w-full max-w-lg bg-black/80 border border-gray-700 rounded-xl shadow-2xl p-8 backdrop-blur-md">
      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={() => handleChangeTab(0)}
          className={`px-6 py-2 text-base font-semibold border-b-2 transition-all duration-300 ${
            activeTabId === 0 ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => handleChangeTab(1)}
          className={`px-6 py-2 text-base font-semibold border-b-2 transition-all duration-300 ${
            activeTabId === 1 ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Agent
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-md text-center">
          {errorMessage.toString()}
        </div>
      )}

      {/* Login Form */}
      {activeTabId === 0 && (
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              onClick={handleLogin}
              disabled={!emailValue || !passwordValue}
              className={`w-full py-3 text-white font-semibold rounded-lg transition duration-300 ${
                !emailValue || !passwordValue
                  ? "bg-blue-500/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Agent Form */}
      {activeTabId === 1 && (
        <div className="space-y-5">
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-300">
              Mobile Number
            </label>
            <input
              id="number"
              type="number"
              onChange={(e) => setphone(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              onClick={handleform}
              disabled={!phone || !password}
              className={`w-full py-3 text-white font-semibold rounded-lg transition duration-300 ${
                !phone || !password ? "bg-blue-500/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-gray-500">© 2025 Nagodpay. All rights reserved.</p>
    </div>
  </div>
</section>


  );
}

export default Login;