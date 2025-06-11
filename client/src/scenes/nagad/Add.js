import React, { useState } from "react";
import Swal from "sweetalert2";
import { Box, useTheme, useMediaQuery, Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Header from "components/Header";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { generalApi } from "state/api";

const Add = ({ setIsAdding }) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [appKey, setAppKey] = useState("");
  const [appSecretKey, setAppSecretKey] = useState("");

  const [accountNameError, setAccountNameError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [appKeyError, setAppKeyError] = useState("");
  const [appSecretKeyError, setAppSecretKeyError] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();

    if (!accountName) {
      setAccountNameError("Please enter API account name.");
    } else {
      setAccountNameError("");
    }

    if (!accountNumber) {
      setAccountNumberError("Please enter API account number.");
    } else {
      setAccountNumberError("");
    }

    if (!username) {
      setUsernameError("Please enter API username.");
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Please enter API password.");
    } else {
      setPasswordError("");
    }

    if (!appKey) {
      setAppKeyError("Please enter API app key.");
    } else {
      setAppKeyError("");
    }

    if (!appSecretKey) {
      setAppSecretKeyError("Please enter API app secret key.");
    } else {
      setAppSecretKeyError("");
    }

    if (
      !accountName ||
      accountNameError ||
      !accountNumber ||
      accountNumberError ||
      !username ||
      usernameError ||
      !password ||
      passwordError ||
      !appKey ||
      appKeyError ||
      !appSecretKey ||
      appSecretKeyError
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please check the input fields.",
        showConfirmButton: true,
      });
    }

    generalApi
      .general()
      .addApiAccountNagad({
        accountName,
        accountNumber,
        username,
        password,
        appKey,
        appSecretKey,
      })
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Added!",
            text: `${accountName}'s API account has been added.`,
            showConfirmButton: false,
            timer: 1500,
          });

          setIsAdding(false);
        } else {
          console.log(res.data.error);

          Swal.fire({
            icon: "error",
            title: "Error!",
            text: `Failed to add(${res.data.error}).`,
            showConfirmButton: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);

        Swal.fire({
          icon: "error",
          title: "Error!",
          text: `Failed to add(${err.response.data.error}).`,
          showConfirmButton: true,
        });
      });
  };

  const handleAccountNameChange = (event) => {
    setAccountName(event.target.value);
  };

  const handleAccountNumberChange = (event) => {
    setAccountNumber(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAppKeyChange = (event) => {
    setAppKey(event.target.value);
  };

  const handleAppSecretKeyChange = (event) => {
    setAppSecretKey(event.target.value);
  };

  return (
    <Box
      mt="20px"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="70px"
      gap="20px"
      sx={{
        "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
      }}
    >
      <Box
        gridColumn="span 12"
        gridRow="span 4"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="Add Nagad API Account Details" />
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="80px"
        >
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="accountName"
              label="Account Name"
              style={{ width: "100%" }}
              defaultValue=""
              value={accountName}
                                             sx={{
    height: "70px",
    "& .MuiInputBase-root": {
      height: "70px",
    },
"& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d8e0", // Default outline color
            borderWidth: "2px",  // Outline thickness
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "green", // Outline color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2bcbba", // Outline color when focused
          },
"& .MuiInputBase-input": {
      padding: "10px 14px", // Adjust padding
      fontSize: "18px",     // Adjust font size
        letterSpacing: "0.1em", 
    },
  }}
              onChange={handleAccountNameChange}
              error={!!accountNameError}
              helperText={accountNameError}
            />
          </Box>
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="accountNumber"
              label="Account Number"
              style={{ width: "100%" }}
              defaultValue=""
              value={accountNumber}
                                             sx={{
    height: "70px",
    "& .MuiInputBase-root": {
      height: "70px",
    },
"& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d8e0", // Default outline color
            borderWidth: "2px",  // Outline thickness
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "green", // Outline color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2bcbba", // Outline color when focused
          },
"& .MuiInputBase-input": {
      padding: "10px 14px", // Adjust padding
      fontSize: "18px",     // Adjust font size
        letterSpacing: "0.1em", 
    },
  }}
              onChange={handleAccountNumberChange}
              error={!!accountNumberError}
              helperText={accountNumberError}
            />
          </Box>
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="username"
              label="Username"
              style={{ width: "100%" }}
              defaultValue=""
              value={username}
              onChange={handleUsernameChange}
              error={!!usernameError}
              helperText={usernameError}
                                             sx={{
    height: "70px",
    "& .MuiInputBase-root": {
      height: "70px",
    },
"& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d8e0", // Default outline color
            borderWidth: "2px",  // Outline thickness
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "green", // Outline color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2bcbba", // Outline color when focused
          },
"& .MuiInputBase-input": {
      padding: "10px 14px", // Adjust padding
      fontSize: "18px",     // Adjust font size
        letterSpacing: "0.1em", 
    },
  }}
            />
          </Box>
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="password"
              label="Password"
              style={{ width: "100%" }}
              defaultValue=""
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
                                             sx={{
    height: "70px",
    "& .MuiInputBase-root": {
      height: "70px",
    },
"& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d8e0", // Default outline color
            borderWidth: "2px",  // Outline thickness
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "green", // Outline color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2bcbba", // Outline color when focused
          },
"& .MuiInputBase-input": {
      padding: "10px 14px", // Adjust padding
      fontSize: "18px",     // Adjust font size
        letterSpacing: "0.1em", 
    },
  }}
            />
          </Box>
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="appKey"
              label="App Key"
              style={{ width: "100%" }}
              defaultValue=""
              value={appKey}
              onChange={handleAppKeyChange}
              error={!!appKeyError}
              helperText={appKeyError}
                                             sx={{
    height: "70px",
    "& .MuiInputBase-root": {
      height: "70px",
    },
"& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d8e0", // Default outline color
            borderWidth: "2px",  // Outline thickness
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "green", // Outline color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2bcbba", // Outline color when focused
          },
"& .MuiInputBase-input": {
      padding: "10px 14px", // Adjust padding
      fontSize: "18px",     // Adjust font size
        letterSpacing: "0.1em", 
    },
  }}
            />
          </Box>
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="appSecretKey"
              label="App Secret Key"
              style={{ width: "100%" }}
              defaultValue=""
              value={appSecretKey}
              onChange={handleAppSecretKeyChange}
              error={!!appSecretKeyError}
              helperText={appSecretKeyError}
                                             sx={{
    height: "70px",
    "& .MuiInputBase-root": {
      height: "70px",
    },
"& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d8e0", // Default outline color
            borderWidth: "2px",  // Outline thickness
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "green", // Outline color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2bcbba", // Outline color when focused
          },
"& .MuiInputBase-input": {
      padding: "10px 14px", // Adjust padding
      fontSize: "18px",     // Adjust font size
        letterSpacing: "0.1em", 
    },
  }}
            />
          </Box>
        </Box>
      </Box>
      <Button id="submit" variant="contained" onClick={handleAdd}>
        Add
      </Button>
      <Button
        id="cancel"
        variant="contained"
        onClick={() => setIsAdding(false)}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default Add;
