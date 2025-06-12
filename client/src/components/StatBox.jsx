import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";

const StatBox = ({ title, value, approved, rate, icon }) => {
  const theme = useTheme();
  return (
    <Box
      gridColumn="span 4"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <FlexBetween>
        <Typography sx={{fontSize:"16px" ,color: theme.palette.secondary[100],marginBottom:"10px"}}>
          {title}
        </Typography>
        
      </FlexBetween>

      <Typography
        fontWeight="600"
        sx={{ color: theme.palette.secondary[200], display: 'flex',fontSize:"20px"}}
      >
        {icon} {value}
      </Typography>
      <FlexBetween gap="1rem">
        <Typography
          fontStyle="italic"
          sx={{ color: theme.palette.secondary.light,fontSize:"22px"}}
        >
          Processed Orders: <span style={{fontWeight: '600'}}>{approved}</span>
        </Typography>
        <Typography
          fontStyle="italic"
          sx={{ color: theme.palette.secondary.light,fontSize:"22px" }}
        >
          Rate: <span style={{fontWeight: '600'}}>{rate} %</span>
        </Typography>
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
