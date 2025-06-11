import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/easypay-logo.png';
import Swal from 'sweetalert2';
const AgentApproval = () => {
  const navigate = useNavigate();
  const agent_info = JSON.parse(localStorage.getItem('agent_info'));

const handleLogout = () => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out of your account!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout',
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('agent_info');
      navigate('/login');
      Swal.fire('Logged out!', 'You have been logged out.', 'success');
    }
  });
};
  useEffect(() => {
    if (!agent_info) {
      navigate('/login');
    } else if (agent_info.status === 'deactivated') {
      navigate('/agent/waiting-for-approval');
    } else if (agent_info.status === 'activated') {
      navigate('/agent-dashboard');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <section className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="w-full bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-indigo-600"> Agent Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-base text-gray-700 font-medium hidden sm:block">
            {agent_info?.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 sm:p-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {agent_info?.name}</h1>
          <p className="text-gray-500 mt-1">{agent_info?.email}</p>

          <div className="mt-6">
            <p className="text-base text-gray-700 leading-relaxed">
              Thank you for registering as an agent with <strong>NagodPay</strong>. Our team is currently reviewing your application.
              If any discrepancies are found, your submission may be declined.
            </p>
            <p className="text-sm text-gray-600 mt-3">
              Please allow up to <strong>3 business days</strong> for the verification process.
            </p>
            <div className="mt-6">
              <span className="inline-block px-5 py-2 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full animate-pulse shadow-sm">
                ⏳ Approval Pending
              </span>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default AgentApproval;
