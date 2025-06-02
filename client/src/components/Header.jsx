import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";
const Header = ({ title, subTitle }) => {
  const theme = useTheme();

  return (
    <Box>
      {/* <div style={{padding:"10px 20px",background:"#f1f2f6",marginBottom:'20px',borderRadius:"5px",cursor:"pointer"}}>
       <NavLink to="/deposit-system">
         <p style={{fontSize:"20px",fontWeight:"600"}}>Deposit: 00</p>
       </NavLink>
      </div> */}
      <Typography
        variant="h4"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={theme.palette.secondary[300]}>
        {subTitle}
      </Typography>
    </Box>
  );
};

export default Header;
