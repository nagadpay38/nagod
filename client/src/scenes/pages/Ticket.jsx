import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
import { useGetApiAccountBkashQuery, generalApi } from "state/api";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-hot-toast';

const Ticket = () => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { getAuthUser } = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();

  // Ticket state and agent filtering
  const [ticket_data, setTicketData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(5);

  // Filter tickets by ticket_id and search term
  const filteredTickets = ticket_data.filter(ticket =>
    ticket.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter unique tickets by ticket_id
  const uniqueTickets = filteredTickets.filter((ticket, index, self) => 
    index === self.findIndex((t) => (
      t.ticket_id === ticket.ticket_id
    ))
  );

  // Paginated tickets
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = uniqueTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  // Pagination handler
  const handlePagination = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Fetching tickets
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-ticket-data`)
      .then((res) => {
        setTicketData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Box display={isNonMobile ? "flex" : "block"} sx={{ display: "flex", justifyContent: 'space-between' }} width="100%" className="min-h-[80vh] overflow-y-auto">
        <section className='w-full h-[100vh] flex font-poppins'>
          <section className='w-[100%] m-auto py-[20px] xl:py-[40px] px-[20px] lg:px-[30px]'>
            <div className='w-full flex md:justify-between md:flex-row flex-col justify-start'>
              <div className='w-full md:w-auto'>
                <h1 className='text-[20px] font-[600] mb-[8px]'>Ticket List</h1>
              </div>
            </div>

            {/* Search input */}
            <div className="relative flex bg-white overflow-hidden rounded-[5px]">
              <input
                type="search"
                className="relative m-0 -me-0.5 block flex-auto rounded-s border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[10px] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:text-white dark:placeholder:text-neutral-200 dark:autofill:shadow-autofill dark:focus:border-primary"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="z-[2] inline-block rounded-e border-2 border-primary px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50 hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:text-primary-500 dark:hover:bg-blue-950 dark:focus:bg-blue-950"
                type="button">
                Search
              </button>
            </div>

            {/* Ticket List */}
            <section>
              <div className="py-[50px]">
                <div className='w-full bg-gray-700 flex justify-between items-center py-[10px] px-[10px]'>
                  <div>
                    <h1 className='text-[18px] text-white '>Total Ticket : <span>{ticket_data?.length}</span></h1>
                  </div>
                </div>

                <div className="overflow-x-auto border-[1px] border-[#eee] ">
                  <div className="">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="border-b-[2px] border-green-500 bg-white text-black">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Department</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Updated</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {
                            currentTickets.map((data) => {
                              return (
                                <tr key={data.ticket_id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.department}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                    <NavLink to={`/reply-ticket/${data.ticket_id}`} className="hover:underline">#{data.ticket_id}</NavLink>
                                    <br />
                                    {data.message.length > 20 ? <span>{data.message.slice(0, 20)}..</span> : <span>{data.message}</span>}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                      className={`px-[15px] inline-flex text-[15px] py-[5px] leading-5 font-semibold rounded-full ${
                                        data.status === 'sent'
                                          ? 'bg-orange-100 text-orange-800'
                                          : data.status === 'read'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      {data.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.createdAt}</td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">Showing {indexOfFirstTicket + 1} to {indexOfLastTicket} of {uniqueTickets.length} entries</div>
                  <div className="flex">
                    <button
                      className="px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded-l hover:bg-gray-300"
                      onClick={() => handlePagination(currentPage > 1 ? currentPage - 1 : 1)}
                    >
                      Previous
                    </button>
                    <button className="px-3 py-1 text-sm text-white bg-gray-700">{currentPage}</button>
                    <button
                      className="px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded-r hover:bg-gray-300"
                      onClick={() => handlePagination(currentPage < Math.ceil(uniqueTickets.length / ticketsPerPage) ? currentPage + 1 : currentPage)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </section>
      </Box>
    </>
  );
};

export default Ticket;
