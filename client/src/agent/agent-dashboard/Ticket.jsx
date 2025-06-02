import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Contextapi } from "context/Appcontext";
import Dashboardleftside from "components/agentcomponents/Dashboardleftside";
import Dashboradheader from "components/agentcomponents/Dashboardheader";
import toast, { Toaster } from "react-hot-toast";

const Ticket = () => {
  const navigate = useNavigate();
  const agent_info = JSON.parse(localStorage.getItem("agent_info"));
  const { activesidebar, setactivesidebar, activetopbar, setactivetopbar } =
    useContext(Contextapi);
  const [showmodal, setmodal] = useState(false);
  const [copynumber, setcopynumber] = useState("01688494105");
  const [message, setmessage] = useState("");
  const [ticket_data, setticket_data] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setactivetopbar(true);
      } else {
        setactivetopbar(false);
      }
    });
  }, []);

  const create_ticket = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BASE_URL2}/agent-ticket`, {
        message,
        agent_id: agent_info._id,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Ticket",
          text: res.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        ticket_information();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ticket_information = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL2}/agent-ticket/${agent_info._id}`)
      .then((res) => {
        setticket_data(res.data.ticket);
        setFilteredData(res.data.ticket);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    ticket_information();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = ticket_data.filter((data) =>
      data.message.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  // Function to filter unique tickets based on ticket_id
  const getUniqueTickets = (tickets) => {
    const seen = new Set();
    return tickets.filter((ticket) => {
      if (seen.has(ticket.ticket_id)) {
        return false;
      }
      seen.add(ticket.ticket_id);
      return true;
    });
  };

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const uniqueFilteredData = getUniqueTickets(filteredData);
  const paginatedData = uniqueFilteredData.slice(
    startIndex,
    startIndex + ticketsPerPage
  );

  return (
    <section className="w-full h-[100vh] flex font-poppins">
      <section
        className={
          activesidebar
            ? "lg:w-[7%] h-[100vh] transition-all duration-300 overflow-hidden"
            : "w-0 md:w-[18%] transition-all duration-300 h-[100vh]"
        }
      >
        <Dashboardleftside />
        <Toaster />
      </section>
      <section
        className={
          activesidebar
            ? "w-[100%] lg:w-[93%] h-[100vh] bg-[#EFEFFD] overflow-y-auto transition-all duration-300"
            : "transition-all bg-[#EFEFFD] duration-300 w-[100%] overflow-y-auto md:w-[82%] h-[100vh]"
        }
      >
        <Dashboradheader />
        <section className="w-[100%] m-auto py-[20px] xl:py-[20px] px-[10px] lg:px-[20px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[30px] font-[600] mb-[8px]">Create Ticket</h1>
              <p className="text-[16px] text-neutral-600">
                If you face any problem, create a ticket for support.
              </p>
            </div>
            <div>
              <NavLink to="/new-ticket">
                <button className="px-[30px] py-[14px] bg-indigo-500 text-white rounded-[5px] cursor-pointer text-[16px]">
                  New Ticket
                </button>
              </NavLink>
            </div>
          </div>
          <section className="py-[50px]">
            <div className="flex justify-between items-center mb-[20px]">
              <h1 className="text-[18px] text-indigo-600">
                Total Tickets: {uniqueFilteredData.length}
              </h1>
              <div className="relative flex items-center">
                <div className="flex items-center bg-white border border-gray-300 rounded-[5px] px-3 py-2 shadow-md">
                  <AiOutlineSearch className="text-[20px] text-indigo-500 mr-2" />
                  <input
                    type="text"
                    className="flex-grow outline-none text-sm border-none text-gray-700 placeholder-gray-500"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-indigo-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((data) => (
                  <tr key={data.ticket_id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {data.department}
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600">
                      <NavLink
                        to={`/view-ticket/${data.ticket_id}`}
                        className="hover:underline"
                      >
                        #{data.ticket_id}
                      </NavLink>
                      <br />
                      {data.message.length > 10 ? (
                        <span>{data.message.slice(0, 10)}...</span>
                      ) : (
                        <span>{data.message}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {data.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {data.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + ticketsPerPage, uniqueFilteredData.length)}{" "}
                of {uniqueFilteredData.length} entries
              </div>
              <div className="flex">
                {Array.from(
                  { length: Math.ceil(uniqueFilteredData.length / ticketsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1 text-sm ${
                        currentPage === i + 1
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      } rounded ${
                        i === 0
                          ? "rounded-l"
                          : i === uniqueFilteredData.length - 1
                          ? "rounded-r"
                          : ""
                      }`}
                      onClick={() => handlePagination(i + 1)}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          </section>
        </section>
      </section>
    </section>
  );
};

export default Ticket;
