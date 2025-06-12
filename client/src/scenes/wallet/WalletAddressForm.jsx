import React, { useState, useEffect } from "react";
import axios from "axios";

const WalletAddressForm = () => {
  const [formData, setFormData] = useState({
    btcAddress: "",
    usdtAddress: "",
    network: "ERC20",
    note: ""
  });
  const [walletId, setWalletId] = useState(null);
  const [errors, setErrors] = useState({
    btcAddress: "",
    usdtAddress: ""
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL2}/api/general/walletaddress`)
      .then(res => {
        if (res.data) {
          setFormData({
            btcAddress: res.data.btcAddress || "",
            usdtAddress: res.data.usdtAddress || "",
            network: res.data.network || "ERC20",
            note: res.data.note || ""
          });
          setWalletId(res.data._id);
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      btcAddress: "",
      usdtAddress: ""
    };
    if (!formData.btcAddress.trim()) {
      newErrors.btcAddress = "BTC address is required";
      valid = false;
    } else if (formData.btcAddress.length < 25) {
      newErrors.btcAddress = "BTC address appears too short";
      valid = false;
    }

    if (!formData.usdtAddress.trim()) {
      newErrors.usdtAddress = "USDT address is required";
      valid = false;
    } else if (formData.usdtAddress.length < 25) {
      newErrors.usdtAddress = "USDT address appears too short";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    const method = walletId ? "put" : "post";
    const url = walletId
      ? `${process.env.REACT_APP_BASE_URL2}/api/general/walletaddress/${walletId}`
      : `${process.env.REACT_APP_BASE_URL2}/api/general/walletaddress/`;

    axios[method](url, formData)
      .then(response => {
        alert(walletId ? "Wallet updated!" : "Wallet saved!");
        if (!walletId && response.data._id) setWalletId(response.data._id);
      })
      .catch(error => {
        alert("Error saving wallet.");
        console.error(error);
      });
  };

  return (
    <div className="w-full mt-10 bg-white p-8 rounded-xl ">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {walletId ? "Update Your Wallet Address" : "Add Your Wallet Address"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Please provide accurate wallet details.</p>
      </div>
      <form onSubmit={handleSubmit}>
        {/* BTC Address */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">BTC Wallet Address</label>
          <input
            type="text"
            name="btcAddress"
            value={formData.btcAddress}
            onChange={handleChange}
            placeholder="Enter your BTC wallet address"
            className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 ${
              errors.btcAddress ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-green-300"
            }`}
          />
          {errors.btcAddress && (
            <p className="text-sm text-red-600 mt-1">{errors.btcAddress}</p>
          )}
        </div>

        {/* USDT Address */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">USDT Wallet Address</label>
          <input
            type="text"
            name="usdtAddress"
            value={formData.usdtAddress}
            onChange={handleChange}
            placeholder="Enter your USDT wallet address"
            className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 ${
              errors.usdtAddress ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-green-300"
            }`}
          />
          {errors.usdtAddress && (
            <p className="text-sm text-red-600 mt-1">{errors.usdtAddress}</p>
          )}
        </div>

        {/* Network */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">USDT Network</label>
          <select
            name="network"
            value={formData.network}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="ERC20">ERC20</option>
            <option value="TRC20">TRC20</option>
            <option value="BEP20">BEP20</option>
          </select>
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
          <textarea
            name="note"
            rows="3"
            value={formData.note}
            onChange={handleChange}
            placeholder="Any additional note..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
        >
          {walletId ? "Update Wallet" : "Save Wallet"}
        </button>
      </form>
    </div>
  );
};

export default WalletAddressForm;
