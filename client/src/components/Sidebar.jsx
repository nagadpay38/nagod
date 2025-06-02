import React from "react";
import {Box,Divider,Drawer,IconButton,List,ListItem,ListItemButton,ListItemIcon,ListItemText,Typography,useTheme,} from "@mui/material";
import {SettingsOutlined,ChevronLeft,ChevronRightOutlined,HomeOutlined,ShoppingCartOutlined,Groups2Outlined,ReceiptLongOutlined,PublicOutlined,PointOfSaleOutlined,TodayOutlined,CalendarMonthOutlined,AdminPanelSettingsOutlined,TrendingUpOutlined,PieChartOutlined,} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import { BiMessageAltDots } from "react-icons/bi";
import MenuIcon from '@mui/icons-material/Menu'; // Add this import for MenuIcon
import profileImage from "assets/profie.jpeg";
import { capitalizeRole } from "utilities/CommonUtility";
import { PiUserCircleDashedDuotone } from "react-icons/pi";
import { SiConvertio } from "react-icons/si";
import { RiRefund2Line } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FcViewDetails } from "react-icons/fc";
import { PiUsersThreeFill } from "react-icons/pi";
import { BsCreditCard } from "react-icons/bs";
// logo
import { MdOutlineNotificationsActive } from "react-icons/md";
import logo from "assets/easypay-logo.png";
import { MdPendingActions } from "react-icons/md";
import { MdPhoneIphone } from "react-icons/md";
import { SiWebmoney } from "react-icons/si";
const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  let navItems = [];
  if (user.role === "merchant" || user.role === "subadmin") {
    navItems = [
      {
        text: "Dashboard",
        icon: <HomeOutlined />,
      },
      {
        text: "Payment",
        icon: <ReceiptLongOutlined />,
      },
      {
        text: "Payout",
        icon: <PointOfSaleOutlined />,
      },
      {
        text: "Setting",
        icon: <PublicOutlined />,
      },
    ];    
  } else if (user.role === "admin") {
    navItems = [
      {
        text: "Dashboard",
        icon: <HomeOutlined size={30} />,
      },
           {
        text: "Agent",
        icon: <PiUserCircleDashedDuotone size={25} />,
      },
            {
        text: "Sub Agent",
        icon: <MdPendingActions size={25} />,
      },
            {
        text: "Agent Deposit",
        icon: <RiRefund2Line size={25} />,
      },
      {
        text: "Agent Withdraw",
        icon: <BsCreditCard size={25} />,
      },
      //    {
      //   text: "Real Time ALert",
      //   icon: <MdOutlineNotificationsActive size={25} />,
      // },
      {
        text: "Merchants",
        icon: <Groups2Outlined size={25} />,
      },
      {
        text: "Numbers",
        icon: <MdPhoneIphone size={25} />,
      },
      {
        text: "Bkash API",
        icon: <PublicOutlined size={25} />,
      },
      {
        text: "Nagad API",
        icon: <SiWebmoney size={25} />,
      },
      {
        text: "Admin List",
        icon: <PiUsersThreeFill size={25} />,
      },
        {
        text: "Merchant Details",
        icon: <FcViewDetails size={25} />,
      },
      {
        text: "Payment",
        icon: <ReceiptLongOutlined size={25} />,
      },
      {
        text: "Payout",
        icon: <PointOfSaleOutlined size={25} />,
      },
            {
        text: "Forwared Messages",
        icon: <BiMessageAltDots size={25} />,
      },
       {
        text: "Money Convertor",
        icon: <SiConvertio size={25} />,
      },
              {
        text: "Wallet Address",
        icon: <BiSupport size={25} />,
      },
         {
        text: "Ticket",
        icon: <BiSupport size={25} />,
      },
      {
        text: "Setting",
        icon: <PublicOutlined size={25} />,
      },
    ];
  }

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
<Box className={isSidebarOpen ?"bg-[#151A2D]  font-sans no-scollbar":"bg-[#151A2D] w-0 font-sans overflow-hidden no-scollbar"}>
{isSidebarOpen && (
     <Box  open={isSidebarOpen}
     variant="temporary" // Temporary variant for mobile (slides in and out)
     anchor="left"
     sx={{

       width: "100%",
       background:"#151A2D",

     }} width={isSidebarOpen ? "100%" : "0"} >
       <Box width="350px" m="1.5rem 2rem 2rem 3rem">
         <FlexBetween color="#CFF4FC">
           <Box display="flex" alignItems="center" gap="0.5rem">
             <img src={logo} alt="Nagidpay"className="w-[60px]"/>
             <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
               Nagodpay
             </Typography>
           </Box>
           {/* Close button for the sidebar on mobile */}
           <IconButton 
             sx={{ display: { xs: "block", sm: "none" }, position: "absolute", top: "10px", right: "10px", zIndex: 1300 }}
             onClick={() => setIsSidebarOpen(false)}
           >
             <IoClose className="text-[25px] text-white cursor-pointer" sx={{ color: "white" }} />
           </IconButton>
         </FlexBetween>
       </Box>

       <List sx={{ display: "block", marginBottom: "20px" }}>
         {navItems.map(({ text, icon }) => {
           if (!icon) {
             return (
               <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem", fontSize: "22px" }}>
                 {text}
               </Typography>
             );
           }
           const lcText = text.toLowerCase().replaceAll(' ', '_');

           return (
             <ListItem key={text} disablePadding>
               <ListItemButton
                 onClick={() => {
                   navigate(`/${lcText}`);
                   setActive(lcText);
                 }}
                 sx={{
                   borderBottom: "1px solid #4b6584",
                   marginBottom: "15px",
                   backgroundColor: active === lcText ? "#6A3FFF" : "transparent",
                   color: active === lcText ? "#45aaf2" : theme.palette.grey[100],
                 }}
               >
                 <ListItemIcon
                   sx={{
                     ml: "2rem",
                     color: active === lcText ? "#fff" : theme.palette.grey[100],
                   }}
                 >
                   {icon}
                 </ListItemIcon>
                 <ListItemText primary={text} sx={{ color: "#fff", fontSize: "22px" }} className="text-nowrap" />
                 {active === lcText && (
                   <ChevronRightOutlined sx={{ ml: "auto", color: "#000" }} />
                 )}
               </ListItemButton>
             </ListItem>
           );
         })}
       </List>
     </Box>
  )}
</Box>
  );
};

export default Sidebar;
