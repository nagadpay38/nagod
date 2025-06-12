import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import logo from "../assets/easypay-logo.png"
import banner from "../assets/banner2.jpeg"

const Agentregistretion = () => {
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [phone, setphone] = useState("");
    const [file, setfile] = useState();
    const [errortext, seterrortext] = useState("");
    const navigate = useNavigate();

    const validateName = (name) => name.length >= 4 && name.length <= 15;
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 8 && password.length <= 16;
    const validatePhone = (phone) => /^(\+8801|8801|01)[3-9]\d{8}$/.test(phone);
    const validateFile = (file) => {
        if (!file) return false;
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        return allowedTypes.includes(file.type);
    };

    const handleform = (e) => {
        e.preventDefault();

        if (!validateName(name)) return seterrortext("Name must be between 4 and 15 characters.");
        if (!validateEmail(email)) return seterrortext("Please enter a valid email address.");
        if (!validatePassword(password)) return seterrortext("Password must be between 8 and 16 characters.");
        if (!validatePhone(phone)) return seterrortext("Please enter a valid Bangladeshi mobile number.");
        if (!validateFile(file)) return seterrortext("Please upload a valid image file (JPEG/PNG).");

        seterrortext("");

        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("phone", phone);
        formdata.append("file", file);

        axios.post(`${process.env.REACT_APP_BASE_URL2}/agent-registration`, formdata)
            .then((res) => {
                if (res.data.success === true) {
                    toast.success("Registration Successful 🎉🎉");
                    localStorage.setItem("agent_info", JSON.stringify(res.data.agent_info));
                    setTimeout(() => navigate("/agent/waiting-for-approval"), 1000);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                toast.error(err.message || "Something went wrong");
            });
    };

    return (
        <section
            className='relative w-full h-[100vh] bg-cover bg-center flex justify-center items-center'
            style={{
                   backgroundImage: `url(${banner})`
            }}
        >
            <Toaster />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

            {/* Form Card */}
            <section className='relative z-10 w-[95%] md:w-[85%] lg:w-[70%] xl:w-[60%] bg-white/90 backdrop-blur-md border border-white shadow-lg rounded-lg p-6'>
                <div className='text-center'>
                    <img className='w-[130px]  m-auto mb-4' src={logo} alt="Logo" />
                    <h1 className='text-[22px] lg:text-[28px] font-semibold text-[#5B33AD] mb-4'>Agent Registration</h1>
                </div>
                <form onSubmit={handleform}>
                    <div className='flex gap-4 mb-4 lg:flex-row flex-col'>
                        <div className="w-full lg:w-1/2">
                            <label className='text-sm font-medium text-neutral-700'>Name</label>
                            <input
                                type="text"
                                placeholder='Enter your name'
                                onChange={(e) => setname(e.target.value)}
                                className='w-full mt-2 border border-gray-300 rounded px-4 h-[48px] text-sm focus:outline-none focus:ring-2 focus:ring-[#5B33AD]'
                            />
                        </div>
                        <div className="w-full lg:w-1/2">
                            <label className='text-sm font-medium text-neutral-700'>Email</label>
                            <input
                                type="text"
                                placeholder='Enter your email'
                                onChange={(e) => setemail(e.target.value)}
                                className='w-full mt-2 border border-gray-300 rounded px-4 h-[48px] text-sm focus:outline-none focus:ring-2 focus:ring-[#5B33AD]'
                            />
                        </div>
                    </div>

                    <div className='flex gap-4 mb-4 lg:flex-row flex-col'>
                        <div className="w-full lg:w-1/2">
                            <label className='text-sm font-medium text-neutral-700'>Password</label>
                            <input
                                type="password"
                                placeholder='********'
                                onChange={(e) => setpassword(e.target.value)}
                                className='w-full mt-2 border border-gray-300 rounded px-4 h-[48px] text-sm focus:outline-none focus:ring-2 focus:ring-[#5B33AD]'
                            />
                        </div>
                        <div className="w-full lg:w-1/2">
                            <label className='text-sm font-medium text-neutral-700'>Phone</label>
                            <input
                                type="number"
                                placeholder='+880'
                                onChange={(e) => setphone(e.target.value)}
                                className='w-full mt-2 border border-gray-300 rounded px-4 h-[48px] text-sm focus:outline-none focus:ring-2 focus:ring-[#5B33AD]'
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className='text-sm font-medium text-neutral-700'>
                            NID / Passport Copy <span className='text-gray-500'>(MAX. 800x400px)</span>
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setfile(e.target.files[0])}
                            className="mt-2 block w-full text-sm text-gray-600 border border-gray-300 rounded file:bg-[#5B33AD] file:text-white file:px-4 file:py-2 file:border-0"
                        />
                    </div>

                    {errortext && (
                        <p className='text-red-600 text-sm mb-3'>{errortext}</p>
                    )}

                    <button
                        type='submit'
                        className='w-full h-[50px] bg-[#5B33AD] hover:bg-[#472b8f] transition-all text-white rounded text-[16px] font-medium'
                    >
                        Register
                    </button>
                </form>
            </section>
        </section>
    );
};

export default Agentregistretion;
