import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Header from "components/Header";
import { generalApi } from "state/api";

const Add = ({ setIsAdding }) => {
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    username: '',
    password: '',
    appKey: '',
    appSecretKey: '',
    limit: '',
  });

  const [errors, setErrors] = useState({
    accountName: '',
    accountNumber: '',
    username: '',
    password: '',
    appKey: '',
    appSecretKey: '',
    limit: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim() // Added trim() to remove whitespace
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Only validate required fields
    const requiredFields = ['accountName', 'accountNumber', 'username', 'password', 'appKey', 'appSecretKey', 'limit'];
    
    requiredFields.forEach(key => {
      if (!formData[key] || !formData[key].toString().trim()) {
        newErrors[key] = `Please enter ${key === 'appKey' ? 'API app key' : 
                         key === 'appSecretKey' ? 'API app secret key' : 
                         key === 'accountName' ? 'API account name' :
                         key === 'accountNumber' ? 'API account number' :
                         key === 'username' ? 'API username' :
                         key === 'password' ? 'API password' : 'account limit'}.`;
        isValid = false;
      } else {
        newErrors[key] = '';
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    // if (!validateForm()) {
    //   return Swal.fire({
    //     icon: 'error',
    //     title: 'Error!',
    //     text: 'Please fill in all required fields.',
    //     showConfirmButton: true,
    //   });
    // }

    try {
      // Create a clean payload with only the needed fields
      const payload = {
        accountName: formData.accountName.trim(),
        accountNumber: formData.accountNumber.trim(),
        username: formData.username.trim(),
        password: formData.password.trim(),
        appKey: formData.appKey.trim(),
        appSecretKey: formData.appSecretKey.trim(),
        limit: formData.limit.trim(),
      };

      console.log("Sending payload:", payload); // Debug log
      
      const res = await generalApi.general().addApiAccountBkash(payload);
      
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `${formData.accountName}'s API account has been added.`,
          showConfirmButton: false,
          timer: 1500,
        });

        setIsAdding(false);
      } else {
        console.log("Error response:", res.data);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Failed to add: ${res.data.error || 'Unknown error'}`,
          showConfirmButton: true,
        });
      }
    } catch (err) {
      console.log("API error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to add: ${err.response?.data?.error || 'Server error'}`,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="mt-5 grid grid-cols-12 gap-5">
      <div className="col-span-12 bg-white p-4 rounded-lg shadow">
        <Header title="" subTitle="Add Bkash API Account Details" />
        
        <div className="grid grid-cols-12 gap-4 mt-4">
          {/* Account Name */}
          <div className="col-span-12 md:col-span-6 p-2">
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              id="accountName"
              name="accountName"
              type="text"
              value={formData.accountName}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                errors.accountName ? 'border-red-500' : 'border-gray-300 hover:border-green-500'
              }`}
            />
            {errors.accountName && (
              <p className="mt-1 text-sm text-red-500">{errors.accountName}</p>
            )}
          </div>

          {/* Account Number */}
          <div className="col-span-12 md:col-span-6 p-2">
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              value={formData.accountNumber}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                errors.accountNumber ? 'border-red-500' : 'border-gray-300 hover:border-green-500'
              }`}
            />
            {errors.accountNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.accountNumber}</p>
            )}
          </div>

          {/* Username */}
          <div className="col-span-12 md:col-span-6 p-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                errors.username ? 'border-red-500' : 'border-gray-300 hover:border-green-500'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="col-span-12 md:col-span-6 p-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300 hover:border-green-500'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* App Key */}
          <div className="col-span-12 md:col-span-6 p-2">
            <label htmlFor="appKey" className="block text-sm font-medium text-gray-700 mb-1">
              App Key <span className="text-red-500">*</span>
            </label>
            <input
              id="appKey"
              name="appKey"
              type="text"
              value={formData.appKey}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                errors.appKey ? 'border-red-500' : 'border-gray-300 hover:border-green-500'
              }`}
            />
            {errors.appKey && (
              <p className="mt-1 text-sm text-red-500">{errors.appKey}</p>
            )}
          </div>

          {/* App Secret Key */}
          <div className="col-span-12 md:col-span-6 p-2">
            <label htmlFor="appSecretKey" className="block text-sm font-medium text-gray-700 mb-1">
              App Secret Key <span className="text-red-500">*</span>
            </label>
            <input
              id="appSecretKey"
              name="appSecretKey"
              type="text"
              value={formData.appSecretKey}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                errors.appSecretKey ? 'border-red-500' : 'border-gray-300 hover:border-green-500'
              }`}
            />
            {errors.appSecretKey && (
              <p className="mt-1 text-sm text-red-500">{errors.appSecretKey}</p>
            )}
          </div>

          {/* Limit */}
          <div className="col-span-12 md:col-span-6 p-2">
            <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
              Limit <span className="text-red-500">*</span>
            </label>
            <input
              id="limit"
              name="limit"
              type="number"
              value={formData.limit}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                errors.limit ? 'border-red-500' : 'border-gray-300 hover:border-green-500'
              }`}
            />
            {errors.limit && (
              <p className="mt-1 text-sm text-red-500">{errors.limit}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setIsAdding(false)}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add;