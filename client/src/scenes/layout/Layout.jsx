import React, { useState, useContext, useEffect } from "react";
import { useNavigate  } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { useGetUserQuery } from "state/api";
import { AuthContext } from "../../context/AuthContext";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const userId = useSelector((state) => state.global.userId);
  
  // const { data } = useGetUserQuery(userId);
  
  const navigate = useNavigate();
  const { getAuthUser, isAuthenticated } = useContext(AuthContext);
  const authUser = getAuthUser();
  console.log("authUser", authUser);

  const _isAuthenticated = isAuthenticated();
  console.log("isAuthenticated", _isAuthenticated);

  // useEffect(() => {
  //   if (authUser === null || !_isAuthenticated) {
  //     navigate("/login");
  //   }
  // }, [authUser, _isAuthenticated, navigate]);

  // console.log(data);

  return (
<Box 
  display={{ xs: "block", sm: "flex" }} 
  width="100%" 
>
  {/* Sidebar */}
<Sidebar
  user={authUser || {}}
  isNonMobile={isNonMobile}
  drawerWidth={{
    xs: "100%", // Sidebar takes full width on small screens
    sm: isSidebarOpen ? "25%" : "0%" // 25% width when sidebar is open on larger screens, 0% when closed
  }}
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>

  {/* Main content area */}
  <Box 
    sx={{
      width: {
        xs: "100%", // Full width on small screens
        sm: isSidebarOpen ? "100%" : "100%" // 75% width when sidebar is open on large screens, 100% when closed
      },
    }}
  >
    {/* Navbar */}
    <Navbar
      user={authUser || {}}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    />
    
    {/* Main Content */}
    <Outlet sx={{ width: "100%",height:"100%"}} />
  </Box>
</Box>

  );
};

export default Layout;
