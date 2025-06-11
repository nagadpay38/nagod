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
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';

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

  // Withdrawal state
  const [data, setData] = useState([]);
  const [agentData, setAgentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [transiction_value, settransiction_value] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [orderId, setOrderId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [withdrawalStatus, setWithdrawalStatus] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
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

  // Resend callback function
  const handleResendCallback = (id) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/payment/resendCallbackPayout`, {
        authEmail: agent_info.email,
        payment_id: id,
      })
      .then((res) => {
        if (res.data.message) {
          Swal.fire({
            icon: "info",
            title: "Info!",
            text: res.data.message,
            showConfirmButton: true,
          });
        }
        fetchWithdrawals();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  // Auto refresh setup
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        fetchWithdrawals();
      }, 5000); // Refresh every 5 seconds
    } else {
      clearInterval(refreshIntervalRef.current);
    }

    return () => {
      clearInterval(refreshIntervalRef.current);
    };
  }, [autoRefresh, page, pageSize]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setactivetopbar(true);
      } else {
        setactivetopbar(false);
      }
    });
    fetchWithdrawals();
  }, [page, pageSize]);

  // Withdrawal functions
  const dateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchWithdrawals = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL2}/agent-withdrawal-data/${agent_info._id}`, {
        params: {
          status: withdrawalStatus,
          orderId,
          transactionId,
          minAmount,
          maxAmount,
          startDate: dateToString(startDate),
          endDate: dateToString(endDate),
          page: page + 1, // API uses 1-based indexing
          limit: pageSize,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data.withdrawalRequests);
          setAgentData(res.data.data.agent);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleUpdate = (row) => {
    setSelectedRow(row);
    setStatus(row.status);
    settransiction_value(row.transactionId || "");
    setIsModalOpen(true);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSaveUpdate = () => {
    if (!status) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Status is required!',
      });
      return;
    }

    if (selectedRow) {
      const rowId = selectedRow._id;
      const newStatus = status;
      
      axios.post(`${process.env.REACT_APP_BASE_URL}/payment/changePayoutStatus`, {
        status: newStatus,
        payment_id: selectedRow.transactionId,
        transactionId: transiction_value,
        admin_name: agent_info._id
      }).then((res) => {
        if(res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Update Success',
            text: `${res.data.message}`,
          });
          
          // Only resend callback if status is changed to success
          if (newStatus === "success") {
            handleResendCallback(selectedRow.transactionId);
          } else {
            fetchWithdrawals();
          }
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

  const withdrawalTableColumns = [
    {
      field: "transactionId",
      headerName: "TRANSACTION ID",
      flex: 0.8,
      renderCell: (params) => (
        <div className="flex items-center">
          {params.row.transactionId || "N/A"}
          {params.row.transactionId && (
            <button 
              onClick={() => copyToClipboard(params.row.transactionId)}
              className="ml-2 text-gray-500 hover:text-blue-500"
            >
              <AiOutlineCopy size={14} />
            </button>
          )}
        </div>
      ),
    },
    {
      field: "date",
      headerName: "DATE",
      flex: 0.6,
      renderCell: (params) => {
        const date = new Date(params.row.date);
        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
        return date.toLocaleString("en-US", options);
      },
    },
    {
      field: "method",
      headerName: "METHOD",
      flex: 0.5,
    },
    {
      field: "payeeAccount",
      headerName: "PAYEE ACCOUNT",
      flex: 0.7,
      renderCell: (params) => (
        <div className="flex items-center">
          {params.row.payeeAccount || "N/A"}
          {params.row.payeeAccount && (
            <button 
              onClick={() => copyToClipboard(params.row.payeeAccount)}
              className="ml-2 text-gray-500 hover:text-blue-500"
            >
              <AiOutlineCopy size={14} />
            </button>
          )}
        </div>
      ),
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      flex: 0.5,
      renderCell: (params) => (
        <div>
          {params.row.amount} {params.row.currency}
        </div>
      ),
    },
    {
      field: "merchantReference",
      headerName: "REFERENCE",
      flex: 0.7,
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 0.5,
      renderCell: (params) => {
        const getStatusStyle = (status) => {
          switch (status?.toLowerCase()) {  // Ensure case-insensitive comparison
            case "pending":
              return { 
                backgroundColor: "#FFF3CD",
                color: "#856404",
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "600",
                fontSize: "12px"
              };
            case "success":
            case "completed":
              return { 
                backgroundColor: "#D4EDDA",
                color: "#155724",
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "600",
                fontSize: "12px"
              };
            case "rejected":
              return { 
                backgroundColor: "#F8D7DA",
                color: "#721C24",
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "600",
                fontSize: "12px"
              };
            case "failed":
              return { 
                backgroundColor: "#F5E6E8",
                color: "#721C24",
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "600",
                fontSize: "12px"
              };
            default:
              return { 
                backgroundColor: "#E2E3E5",
                color: "#383D41",
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "600",
                fontSize: "12px"
              };
          }
        };

        return (
          <span style={getStatusStyle(params.row.status)}>
            {params.row.status?.toUpperCase() || "N/A"}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      flex: 0.8,
      renderCell: (params) => {
        const isDisabled = ["success", "completed", "rejected"].includes(params.row.status?.toLowerCase());
        return (
          <div className="flex space-x-2">
            <Button
              variant="contained"
              onClick={() => handleUpdate(params.row)}
              disabled={isDisabled}
              sx={{
                backgroundColor: isDisabled ? "#e9ecef" : "#007bff",
                color: isDisabled ? "#6c757d" : "white",
                '&:hover': {
                  backgroundColor: isDisabled ? "#e9ecef" : "#0069d9",
                },
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: '600',
                padding: '6px 12px',
                boxShadow: 'none',
                pointerEvents: isDisabled ? 'none' : 'auto',
                opacity: isDisabled ? 0.7 : 1,
              }}
            >
              Update
            </Button>
          </div>
        );
      },
    },
  ];

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    outline: 'none'
  };

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
              <Header title="" subTitle="Withdrawal Requests" />
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
            
            {/* Agent Summary */}
            <Box mb="1rem" backgroundColor="#f8f9fa" p="1.5rem" borderRadius="0.5rem" boxShadow="0 1px 3px rgba(0,0,0,0.1)">
              <Header title="Agent Summary" subTitle="" p="0.rem" />
              <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                <Box p="0.5rem" minWidth="200px">
                  <Typography variant="body2" color="#6c757d">Agent Name</Typography>
                  <Typography variant="h6" fontWeight="600">{agentData.name}</Typography>
                </Box>
                <Box p="0.5rem" minWidth="200px">
                  <Typography variant="body2" color="#6c757d">Account Number</Typography>
                  <Typography variant="h6" fontWeight="600">{agentData.accountNumber}</Typography>
                </Box>
                <Box p="0.5rem" minWidth="200px">
                  <Typography variant="body2" color="#6c757d">Total Balance (BDT)</Typography>
                  <Typography variant="h6" fontWeight="600">{agentData.balance_in_bdt}</Typography>
                </Box>
                <Box p="0.5rem" minWidth="200px">
                  <Typography variant="body2" color="#6c757d">Commission</Typography>
                  <Typography variant="h6" fontWeight="600">{agentData.commission}</Typography>
                </Box>
                <Box p="0.5rem" minWidth="200px">
                  <Typography variant="body2" color="#6c757d">Pending Withdrawals</Typography>
                  <Typography variant="h6" fontWeight="600">
                    {data.filter(req => req.status?.toLowerCase() === 'pending').reduce((sum, req) => sum + req.amount, 0)} BDT
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Withdrawal Filter Section */}
            <Box
              mb="1.5rem"
              backgroundColor="#f8f9fa"
              p="1.5rem"
              borderRadius="0.5rem"
              boxShadow="0 1px 3px rgba(0,0,0,0.1)"
            >
              <Header title="" subTitle="Filter & Search" p="0.rem" />
              <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="80px"
                gap="1rem"
              >
                <Box
                  width="100%"
                  gridColumn="span 3"
                  gridRow="span 1"
                >
                  <TextField
                    id="orderId"
                    label="Order ID"
                    fullWidth
                    variant="outlined"
                    value={orderId}
                    onChange={(event) => setOrderId(event.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ced4da",
                        },
                        "&:hover fieldset": {
                          borderColor: "#80bdff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#80bdff",
                          boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                        },
                      },
                    }}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 3"
                  gridRow="span 1"
                >
                  <TextField
                    id="transactionId"
                    label="Transaction ID"
                    fullWidth
                    variant="outlined"
                    value={transactionId}
                    onChange={(event) => setTransactionId(event.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ced4da",
                        },
                        "&:hover fieldset": {
                          borderColor: "#80bdff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#80bdff",
                          boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                        },
                      },
                    }}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 3"
                  gridRow="span 1"
                >
                  <TextField
                    id="minAmount"
                    label="Min. Amount"
                    fullWidth
                    variant="outlined"
                    value={minAmount}
                    onChange={(event) => setMinAmount(event.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ced4da",
                        },
                        "&:hover fieldset": {
                          borderColor: "#80bdff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#80bdff",
                          boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                        },
                      },
                    }}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 3"
                  gridRow="span 1"
                >
                  <TextField
                    id="maxAmount"
                    label="Max. Amount"
                    fullWidth
                    variant="outlined"
                    value={maxAmount}
                    onChange={(event) => setMaxAmount(event.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ced4da",
                        },
                        "&:hover fieldset": {
                          borderColor: "#80bdff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#80bdff",
                          boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                        },
                      },
                    }}
                  />
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 3"
                  gridRow="span 1"
                >
                  <FormControl fullWidth>
                    <InputLabel id="withdrawal-status-label">Withdrawal Status</InputLabel>
                    <Select
                      labelId="withdrawal-status-label"
                      id="withdrawal-status-select"
                      value={withdrawalStatus}
                      label="Withdrawal Status"
                      onChange={(event) => setWithdrawalStatus(event.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#ced4da",
                          },
                          "&:hover fieldset": {
                            borderColor: "#80bdff",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#80bdff",
                            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                          },
                        },
                      }}
                    >
                      <MenuItem value={"all"}>ALL</MenuItem>
                      <MenuItem value={"pending"}>PENDING</MenuItem>
                      <MenuItem value={"approved"}>APPROVED</MenuItem>
                      <MenuItem value={"completed"}>COMPLETED</MenuItem>
                      <MenuItem value={"rejected"}>REJECTED</MenuItem>
                      <MenuItem value={"failed"}>FAILED</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  width="100%"
                  gridColumn="span 3"
                  gridRow="span 1"
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
                  gridColumn="span 3"
                  gridRow="span 1"
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
                mt="1rem"
              >
                <Button
                  id="search"
                  variant="contained"
                  onClick={() => {
                    setPage(0);
                    fetchWithdrawals();
                  }}
                  sx={{
                    backgroundColor: "#28a745",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                    padding: "8px 16px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#218838",
                      boxShadow: "none",
                    },
                    "&:active": {
                      boxShadow: "none",
                    },
                    mr: 2
                  }}
                >
                  Search
                </Button>
                <Button
                  id="reset"
                  variant="outlined"
                  onClick={() => {
                    setOrderId("");
                    setTransactionId("");
                    setMinAmount("");
                    setMaxAmount("");
                    setWithdrawalStatus("all");
                    setStartDate(new Date(preDate));
                    setEndDate(new Date());
                    setPage(0);
                    fetchWithdrawals();
                  }}
                  sx={{
                    borderColor: "#dc3545",
                    color: "#dc3545",
                    fontSize: "14px",
                    fontWeight: "600",
                    padding: "8px 16px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                      borderColor: "#dc3545",
                    },
                  }}
                >
                  Reset
                </Button>
              </Box>
            </Box>

            {/* Withdrawal Data Grid */}
            <Box
              mb="1.5rem"
              height="70vh"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                  fontSize: "14px",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #e9ecef",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#343a40",
                  color: "white",
                  borderBottom: "none",
                  fontSize: "15px",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: "white",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #e9ecef",
                  backgroundColor: "white",
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                  color: "#495057 !important",
                },
                "& .MuiDataGrid-row": {
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                },
              }}
            >
              <DataGrid
                loading={loading}
                rows={data.map(row => ({ ...row, id: row._id }))}
                columns={withdrawalTableColumns}
                rowCount={data.length}
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
          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="update-status-modal"
            aria-describedby="update-withdrawal-status"
          >
            <Paper sx={modalStyle}>
              <Typography variant="h6" component="h2" mb={3} fontWeight="600">
                Update Withdrawal Status
              </Typography>
              
              <Box mb={3}>
                <Typography variant="subtitle1" mb={1} fontWeight="500">
                  Transaction ID
                </Typography>
                <Box display="flex" alignItems="center">
                  <TextField
                    fullWidth
                    value={transiction_value}
                    onChange={(e) => settransiction_value(e.target.value)}
                    variant="outlined"
                    placeholder="Enter transaction ID"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ced4da",
                        },
                        "&:hover fieldset": {
                          borderColor: "#80bdff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#80bdff",
                          boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                        },
                      },
                    }}
                  />
                  <Button 
                    onClick={() => copyToClipboard(transiction_value)}
                    sx={{
                      ml: 1,
                      minWidth: '40px',
                      height: '56px',
                      backgroundColor: '#f8f9fa',
                      color: '#495057',
                      '&:hover': {
                        backgroundColor: '#e9ecef',
                      }
                    }}
                  >
                    <AiOutlineCopy size={18} />
                  </Button>
                </Box>
              </Box>

              <Box mb={4}>
                <Typography variant="subtitle1" mb={1} fontWeight="500">
                  Status
                </Typography>
                <Select
                  fullWidth
                  value={status}
                  onChange={handleStatusChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ced4da",
                      },
                      "&:hover fieldset": {
                        borderColor: "#80bdff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#80bdff",
                        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                      },
                    },
                  }}
                >
                  {selectOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outlined"
                  sx={{
                    mr: 2,
                    borderColor: "#6c757d",
                    color: "#6c757d",
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                      borderColor: '#6c757d',
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveUpdate}
                  variant="contained"
                  sx={{
                    backgroundColor: "#28a745",
                    color: "white",
                    '&:hover': {
                      backgroundColor: "#218838",
                    }
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Paper>
          </Modal>
        </section>
      </section>
    </section>
  );
};

export default Agentpayout;