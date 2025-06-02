import React, { useContext, useEffect, useState, useRef } from "react";
import { AiOutlineSearch, AiOutlineCopy } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Contextapi } from "context/Appcontext";
import Dashboardleftside from "components/agentcomponents/Dashboardleftside";
import Dashboradheader from "components/agentcomponents/Dashboardheader";
import toast, { Toaster } from "react-hot-toast";
import { Box, useTheme, Button, useMediaQuery, Typography } from "@mui/material";
import DatePicker from "react-datepicker";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from "@mui/material/Select";

// Helper components
const FlexBetween = ({ children, style }) => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    style={style}
  >
    {children}
  </Box>
);

const Header = ({ title, subTitle, p }) => (
  <Box mb={p || "1rem"}>
    <Typography variant="h5" fontWeight="600" color="#2c3e50">
      {title}
    </Typography>
    <Typography variant="body2" color="#7f8c8d">
      {subTitle}
    </Typography>
  </Box>
);

const Agentpayout = () => {
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

  // Payout state
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [transiction_value, settransiction_value] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [provider, setProvider] = useState("all");
  const [orderId, setOrderId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [payeeId, setPayeeId] = useState("");
  const [agentAccount, setAgentAccount] = useState("");
  const [payeeAccount, setPayeeAccount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [payoutStatus, setPayoutStatus] = useState("all");
  const [isTest, setIsTest] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refreshIntervalRef = useRef(null);

  // Current date setup
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const curDate = `${year}-${month}-${day}`;

  currentDate.setMonth(currentDate.getMonth() - 1);
  const pyear = currentDate.getFullYear();
  const pmonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const pday = String(currentDate.getDate()).padStart(2, "0");
  const preDate = `${pyear}-${pmonth}-${pday}`;
   
  const [startDate, setStartDate] = useState(new Date(preDate));
  const [endDate, setEndDate] = useState(new Date());

  const selectOptions = [
    { label: "PENDING", value: "pending" },
    { label: "SUCCESS", value: "success" },
    { label: "REJECTED", value: "rejected" },
  ];

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch((err) => {
      toast.error('Failed to copy text');
      console.error('Failed to copy text: ', err);
    });
  };

  // Auto refresh setup
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        fetchTransactions();
      }, 1000); // Refresh every 1 second
    } else {
      clearInterval(refreshIntervalRef.current);
    }

    return () => {
      clearInterval(refreshIntervalRef.current);
    };
  }, [autoRefresh, page, pageSize, isTest]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setactivetopbar(true);
      } else {
        setactivetopbar(false);
      }
    });
    fetchTransactions();
  }, [page, pageSize, isTest]);

  // Payout functions
  const dateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchTransactions = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/client/payoutTransactions`, {
        params: {
          authUser: JSON.stringify(agent_info),
          provider,
          orderId,
          paymentId,
          agentAccount,
          payeeAccount,
          payeeId,
          transactionId,
          minAmount,
          maxAmount,
          payoutStatus,
          startDate: dateToString(startDate),
          endDate: dateToString(endDate),
          page,
          pageSize,
          sort: JSON.stringify(sort),
          mode: isTest ? "test" : "live",
        },
      })
      .then((res) => {
        setData(res.data);
        setStatus(
          res.data.transactions.map((transaction) => {
            return { [transaction._id]: transaction.status };
          })
        );
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleResendCallback = (id) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/payment/resendCallbackPayout`, {
        authEmail: agent_info.email,
        id,
      })
      .then((res) => {
        console.log(res)
        if (res.data.message) {
          Swal.fire({
            icon: "info",
            title: "Info!",
            text: res.data.message,
            showConfirmButton: true,
          });
        }
        fetchTransactions();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleUpdate = (row) => {
    setSelectedRow(row);
    settransiction_value(row.transactionId || "");
    setStatus(row.status);
    setIsModalOpen(true);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSaveUpdate = () => {
    if (!transiction_value || !status) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Transaction ID and Status are required!',
      });
      return;
    }

    if (selectedRow) {
      const rowId = selectedRow._id;
      const newStatus = status;
      axios.post(`${process.env.REACT_APP_BASE_URL}/payment/changePayoutStatus`, {
        id: rowId,
        transactionId: transiction_value,
        status: newStatus,
      }).then((res) => {
        if(res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Update Success',
            text: `${res.data.message}`,
          });
          
          // Automatically resend callback after status update
          handleResendCallback(rowId);
          
          fetchTransactions();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: `${res.data.message}`,
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    }
    setIsModalOpen(false);
  };

  const handlePaginationModelChange = (newModel) => {
    setPage(newModel.page);
    setPageSize(newModel.pageSize);
  };

  const CustomInput = ({ value, onClick }) => (
    <input
      type="text"
      value={value}
      onClick={onClick}
      style={{
        width: "100%",
        height: "60px",
        padding: "10px",
        borderRadius: "5px",
        borderColor: "#aaa",
        fontSize: "18px",
        border: "2px solid #d1d8e0",
        backgroundColor: "white"
      }}
    />
  );

  const transactionTableColumns = [
    {
      field: "orderId_paymentId",
      headerName: "ORDER ID",
      flex: 0.7,
      renderCell: (params) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            {params.row.orderId}
            <button 
              onClick={() => copyToClipboard(params.row.orderId)}
              className="ml-2 text-gray-500 hover:text-blue-500"
            >
              <AiOutlineCopy size={14} />
            </button>
          </div>
          <div className="flex items-center">
            {params.row.paymentId}
            <button 
              onClick={() => copyToClipboard(params.row.paymentId)}
              className="ml-2 text-gray-500 hover:text-blue-500"
            >
              <AiOutlineCopy size={14} />
            </button>
          </div>
        </div>
      ),
    },
    {
      field: "agent",
      headerName: "PAYMENT CHANNEL",
      flex: 1,
      renderCell: (params) => (
        <>
          {params.row.provider.charAt(0).toUpperCase() + params.row.provider.slice(1)} Personal
          <br />
          <div className="flex items-center">
            {params.row.agentAccount}
            <button 
              onClick={() => copyToClipboard(params.row.agentAccount)}
              className="ml-2 text-gray-500 hover:text-blue-500"
            >
              <AiOutlineCopy size={14} />
            </button>
          </div>
        </>
      ),
    },
    {
      field: "payee",
      headerName: "PAYEE",
      flex: 1,
      renderCell: (params) => (
        <>
          <div className="flex items-center">
            {params.row.payeeId}
            <button 
              onClick={() => copyToClipboard(params.row.payeeId)}
              className="ml-2 text-gray-500 hover:text-blue-500"
            >
              <AiOutlineCopy size={14} />
            </button>
          </div>
          <div className="flex items-center">
            {params.row.payeeAccount}
            <button 
              onClick={() => copyToClipboard(params.row.payeeAccount)}
              className="ml-2 text-gray-500 hover:text-blue-500"
            >
              <AiOutlineCopy size={14} />
            </button>
          </div>
        </>
      ),
    },
    {
      field: "trans",
      headerName: "TRANSACTION ID",
      flex: 1,
      renderCell: (params) => {
        const dateRequest = new Date(params.row.statusDate);
        const dateSent = new Date(params.row.createdAt);

        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };

        const formattedRequestDate = dateRequest.toLocaleString("en-US", options);
        const formattedSentDate = params.row.createdAt
          ? dateSent.toLocaleString("en-US", options)
          : null;

        const expirationDuration = 24 * 60 * 60 * 1000;
        const elapsedTime = dateSent - dateRequest;
        const delayed = elapsedTime > expirationDuration;

        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <span style={delayed ? { color: "#ff7474", cursor: "pointer" } : { cursor: "pointer" }}
                title={formattedSentDate}>
                {params.row.transactionId || "N/A"}
              </span>
              {params.row.transactionId && (
                <button 
                  onClick={() => copyToClipboard(params.row.transactionId)}
                  className="ml-2 text-gray-500 hover:text-blue-500"
                >
                  <AiOutlineCopy size={14} />
                </button>
              )}
            </div>
            {formattedRequestDate && <p className="text-green-500">{formattedRequestDate}</p>}
            {formattedSentDate && <p>{formattedSentDate}</p>}
          </div>
        );
      },
    },
    {
      field: "request",
      headerName: "REQUESTED",
      flex: 0.5,
      renderCell: (params) => (
        <>
          {params.row.requestAmount && params.row.currency + " " + params.row.requestAmount}
        </>
      ),
    },
    {
      field: "requestAmount",
      headerName: "PAID",
      flex: 0.5,
      renderCell: (params) => (
        <>
          {params.row.sentAmount && params.row.currency + " " + params.row.sentAmount}
        </>
      ),
    },
    {
      field: "payable",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => {
        const getStatusStyle = (status) => {
          switch (status) {
            case "pending":
              return { color: "orange", fontWeight: "bold", fontSize: "15px" };
            case "assigned":
              return { color: "blue", fontWeight: "bold", fontSize: "15px" };
            case "success":
              return { color: "green", fontWeight: "bold", fontSize: "15px" };
            case "rejected":
              return { color: "red", fontWeight: "bold", fontSize: "15px" };
            case "failed":
              return { color: "darkred", fontWeight: "bold", fontSize: "15px" };
            default:
              return { color: "gray", fontWeight: "bold", fontSize: "15px" };
          }
        };

        return (
          <span style={getStatusStyle(params.row.status)}>
            {params.row.status || "N/A"}
          </span>
        );
      },
    },
    {
      field: "update",
      headerName: "Update",
      flex: 0.5,
      renderCell: (params) => (
        <button
          onClick={() => handleUpdate(params.row)}
          disabled={params.row.status === "success"}
          style={{
            backgroundColor: params.row.status === "success" ? "#ccc" : "#007BFF",
            color: params.row.status === "success" ? "#666" : "white",
            border: "1px solid",
            borderColor: params.row.status === "success" ? "#ccc" : "#007BFF",
            padding: "8px 16px",
            cursor: params.row.status === "success" ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (params.row.status !== "success") {
              e.target.style.backgroundColor = "#0056b3";
              e.target.style.borderColor = "#0056b3";
            }
          }}
          onMouseLeave={(e) => {
            if (params.row.status !== "success") {
              e.target.style.backgroundColor = "#007BFF";
              e.target.style.borderColor = "#007BFF";
            }
          }}
        >
          Update
        </button>
      ),
    },
  ];

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
            ? "w-[100%] lg:w-[93%] h-[100vh] bg-gray-50 overflow-y-auto transition-all duration-300"
            : "transition-all duration-300 bg-gray-50 w-[100%] overflow-y-auto md:w-[82%] h-[100vh]"
        }
      >
        <Dashboradheader />
        <section className="w-[100%] m-auto py-[20px] xl:py-[20px] px-[10px] lg:px-[20px]">
          <Box m="0rem 1.5rem">
            <FlexBetween style={{ marginBottom: "1rem" }}>
              <Header title="" subTitle="Payout Transactions" />
              <div className="flex items-center">
                <label className="mr-2">Auto Refresh:</label>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={() => setAutoRefresh(!autoRefresh)}
                  className="h-5 w-5 text-blue-600 rounded"
                />
              </div>
            </FlexBetween>
            
            {/* Payout Filter Section */}
            <Box
              mb="1rem"
              backgroundColor="#EFEFFD"
              p="0.5rem"
              borderRadius="0.55rem"
            >
              <Header title="" subTitle="Filter & Search" p="0.rem" />
              <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="80px"
              >
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <FormControl fullWidth>
                    <InputLabel id="provider-label">Provider</InputLabel>
                    <Select
                      labelId="provider-label"
                      id="provider-select"
                      value={provider}
                      label="Provider"
                      onChange={(event) => setProvider(event.target.value)}
                      sx={{
                        height: "60px",
                        "& .MuiInputBase-root": { height: "60px" },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#d1d8e0",
                          borderWidth: "2px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "green",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2bcbba",
                        },
                        "& .MuiInputBase-input": {
                          padding: "10px 14px",
                          fontSize: "16px",
                          letterSpacing: "0.1em",
                        },
                      }}
                    >
                      <MenuItem value={"all"}>ALL</MenuItem>
                      <MenuItem value={"bkash"}>Bkash Personal</MenuItem>
                      <MenuItem value={"nagad"}>Nagad Personal</MenuItem>
                      <MenuItem value={"rocket"}>Rocket Personal</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                {/* Other filter fields... */}
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <TextField
                    id="orderId"
                    label="Order ID"
                    style={{ width: "100%" }}
                    sx={{
                      height: "60px",
                      "& .MuiInputBase-root": { height: "60px" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d8e0",
                        borderWidth: "2px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2bcbba",
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px 14px",
                        fontSize: "16px",
                        letterSpacing: "0.1em",
                      },
                    }}
                    value={orderId}
                    onChange={(event) => setOrderId(event.target.value)}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <TextField
                    id="paymentId"
                    label="Payment ID"
                    style={{ width: "100%" }}
                    sx={{
                      height: "60px",
                      "& .MuiInputBase-root": { height: "60px" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d8e0",
                        borderWidth: "2px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2bcbba",
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px 14px",
                        fontSize: "16px",
                        letterSpacing: "0.1em",
                      },
                    }}
                    value={paymentId}
                    onChange={(event) => setPaymentId(event.target.value)}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <TextField
                    id="agentAccount"
                    label="Bank Account"
                    style={{ width: "100%" }}
                    sx={{
                      height: "60px",
                      "& .MuiInputBase-root": { height: "60px" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d8e0",
                        borderWidth: "2px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2bcbba",
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px 14px",
                        fontSize: "16px",
                        letterSpacing: "0.1em",
                      },
                    }}
                    value={agentAccount}
                    onChange={(event) => setAgentAccount(event.target.value)}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <TextField
                    id="payeeId"
                    label="Payee ID"
                    style={{ width: "100%" }}
                    sx={{
                      height: "60px",
                      "& .MuiInputBase-root": { height: "60px" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d8e0",
                        borderWidth: "2px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2bcbba",
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px 14px",
                        fontSize: "16px",
                        letterSpacing: "0.1em",
                      },
                    }}
                    value={payeeId}
                    onChange={(event) => setPayeeId(event.target.value)}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <TextField
                    id="payeeAccount"
                    label="Payee Account"
                    style={{ width: "100%" }}
                    sx={{
                      height: "60px",
                      "& .MuiInputBase-root": { height: "60px" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d8e0",
                        borderWidth: "2px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2bcbba",
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px 14px",
                        fontSize: "16px",
                        letterSpacing: "0.1em",
                      },
                    }}
                    value={payeeAccount}
                    onChange={(event) => setPayeeAccount(event.target.value)}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <TextField
                    id="transactionId"
                    label="Transaction ID"
                    style={{ width: "100%" }}
                    sx={{
                      height: "60px",
                      "& .MuiInputBase-root": { height: "60px" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d8e0",
                        borderWidth: "2px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2bcbba",
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px 14px",
                        fontSize: "16px",
                        letterSpacing: "0.1em",
                      },
                    }}
                    value={transactionId}
                    onChange={(event) => setTransactionId(event.target.value)}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <TextField
                    id="minAmount"
                    label="Min. Amount"
                    style={{ width: "100%" }}
                    sx={{
                      height: "60px",
                      "& .MuiInputBase-root": { height: "60px" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d8e0",
                        borderWidth: "2px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2bcbba",
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px 14px",
                        fontSize: "16px",
                        letterSpacing: "0.1em",
                      },
                    }}
                    value={minAmount}
                    onChange={(event) => setMinAmount(event.target.value)}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <TextField
                    id="maxAmount"
                    label="Max. Amount"
                    style={{ width: "100%" }}
                    sx={{
                      height: "60px",
                      "& .MuiInputBase-root": { height: "60px" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d8e0",
                        borderWidth: "2px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2bcbba",
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px 14px",
                        fontSize: "16px",
                        letterSpacing: "0.1em",
                      },
                    }}
                    value={maxAmount}
                    onChange={(event) => setMaxAmount(event.target.value)}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <FormControl fullWidth>
                    <InputLabel id="payout-status-label">Payout Status</InputLabel>
                    <Select
                      labelId="payout-status-label"
                      id="payout-status-select"
                      value={payoutStatus}
                      label="Payout Status"
                      onChange={(event) => setPayoutStatus(event.target.value)}
                      sx={{
                        height: "60px",
                        "& .MuiInputBase-root": { height: "60px" },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#d1d8e0",
                          borderWidth: "2px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "green",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2bcbba",
                        },
                        "& .MuiInputBase-input": {
                          padding: "10px 14px",
                          fontSize: "16px",
                          letterSpacing: "0.1em",
                        },
                      }}
                    >
                      <MenuItem value={"all"}>ALL</MenuItem>
                      <MenuItem value={"pending"}>PENDING</MenuItem>
                      <MenuItem value={"assigned"}>ASSIGNED</MenuItem>
                      <MenuItem value={"success"}>SUCCESS</MenuItem>
                      <MenuItem value={"rejected"}>REJECTED</MenuItem>
                      <MenuItem value={"failed"}>FAILED</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    customInput={<CustomInput />}
                  />
                </Box>

                <Box
                  width="100%"
                  height="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  p="0.5rem"
                >
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    customInput={<CustomInput />}
                  />
                </Box>
              </Box>

              <Box
                width="100%"
                display="flex"
                justifyContent="flex-end"
                p="0.5rem"
              >
                <Button
                  id="search"
                  variant="contained"
                  onClick={() => {
                    setPage(0);
                    fetchTransactions();
                  }}
                  sx={{
                    backgroundColor: "#2bcbba",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    "&:hover": {
                      backgroundColor: "#20a895",
                    },
                  }}
                >
                  Search
                </Button>
                <Button
                  id="reset"
                  variant="contained"
                  onClick={() => {
                    setProvider("all");
                    setOrderId("");
                    setPaymentId("");
                    setTransactionId("");
                    setPayeeId("");
                    setAgentAccount("");
                    setPayeeAccount("");
                    setMinAmount("");
                    setMaxAmount("");
                    setPayoutStatus("all");
                    setStartDate(new Date(preDate));
                    setEndDate(new Date());
                    setPage(0);
                    fetchTransactions();
                  }}
                  sx={{
                    backgroundColor: "#ff7675",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    marginLeft: "10px",
                    "&:hover": {
                      backgroundColor: "#d63031",
                    },
                  }}
                >
                  Reset
                </Button>
              </Box>
            </Box>

            {/* Payout Data Grid */}
            <Box
              m="0rem 0"
              height="70vh"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#2bcbba",
                  color: "white",
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: "white",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: "#2bcbba",
                  color: "white",
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                  color: "#2bcbba !important",
                },
              }}
            >
              <DataGrid
                loading={loading}
                rows={(data.transactions || []).map(row => ({ ...row, id: row._id }))}
                columns={transactionTableColumns}
                rowCount={data.total || 0}
                rowsPerPageOptions={[20, 50, 100]}
                pagination
                page={page}
                pageSize={pageSize}
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                onPaginationModelChange={handlePaginationModelChange}
                components={{ Toolbar: GridToolbar }}
              />
            </Box>
          </Box>

          {/* Update Status Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-[10000]">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Update Transaction Status</h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Transaction ID</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={transiction_value}
                      onChange={(e) => settransiction_value(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter transaction ID"
                    />
                    <button 
                      onClick={() => copyToClipboard(transiction_value)}
                      className="ml-2 p-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <AiOutlineCopy size={18} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={handleStatusChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {selectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveUpdate}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    </section>
  );
};

export default Agentpayout;