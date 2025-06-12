import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { useMemo, useContext } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import { AuthProvider } from "./context/AuthContext";
import Homepage from "./scenes/pages/Hompage"
import Ticket_admin from "scenes/pages/Ticket";
import Forwaredmessage from "scenes/pages/Forwaredmessage"
// context
// import { AuthContext } from "./context/AuthContext";
import {
  Dashboard,
  Layout,
  Products,
  Users,
  Merchants,
  Numbers,
  Bkash,
  Payment,
  Payout,
  Geography,
  Overview,
  Daily,
  Monthly,
  Breakdown,
  Admin,
  Performance,
  Pointofsale,
  Profile,
  Checkout,
  Checkoutdemo,
  Callbackbkash,
  Login,
  PageNotFound
} from "scenes";
import Nagad from "scenes/nagad/Nagad";
import Home from "../src/scenes/pages/Home"
import "./index.css"
import Depositsystem from "scenes/pament-system/Depositsystem";
import Bkashpament from "scenes/pament-system/Bkashpament";
import Nagadpament from "scenes/pament-system/Nagadpament";
import Agentlogin from "agent/Agentlogin";
import { Appprovider } from "context/Appcontext";
import AgentDashboard from "agent/agent-dashboard/AgentDashboard";
import Agentregistretion from "agent/Agentregistretion";
import Depositpage from "agent/agent-dashboard/Depositpage";
import Ageentapproval from "agent/Ageentapproval";
import Depositandtopup from "agent/agent-dashboard/Depositandtopup";
import Report from "agent/agent-dashboard/Report";
import Ticket from "agent/agent-dashboard/Ticket";
import Agentprofile from "agent/agent-dashboard/Agentprofile";
import Agent from "scenes/pages/Agent";
import Agentdetails from "scenes/pages/Agentdetails";
import Pendingaggent from "scenes/pages/Pendingaggent";
import Agentdepositpage from "scenes/pages/Agentdepositpage";
import Depositinvoice from "scenes/pages/Depositinvoice";
import Withdraw from "scenes/checkout/Withdraw";
import Moneyconvertor from "scenes/pages/Moneyconvertor";
import Checkoutmain from "scenes/checkout/Checkoutmain";
import Userprofile from "scenes/merchant_test/Userprofile";
import Usersignup from "scenes/merchant_test/Usersignup";
import Userlogin from "scenes/merchant_test/Userlogin";
import P2Pdepositpage from "scenes/checkout/P2Pdepositpage";
import WithdrawForm from "scenes/merchant_test/WithdrawForm";
import Newticket from "agent/agent-dashboard/Newticket";
import Viewticket from "agent/agent-dashboard/Viewticket";
import Replyticket from "scenes/pages/Replyticket";
import Merchanttable from "scenes/pages/Merchanttable";
import Merchantdetails from "scenes/pages/Merchantdetails";
import Adminrole from "scenes/pages/Adminrole";
import Createuser from "scenes/pages/Createuser";
import Agentwithdraw from "agent/agent-dashboard/Agentwithdraw";
import Agentwithdrawal from "scenes/pages/Agentwithdrawal";
import Agentpayout from "agent/agent-dashboard/Agentpayout";
import Document from "scenes/pages/Document";
import Walletaddress from "scenes/wallet/Walletaddress";
import Addbank from "agent/agent-dashboard/bank/Addbank";
import Bankaccount from "agent/agent-dashboard/bank/Bankaccount";
function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <Appprovider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/users" element={<Users />} />
                <Route path="/merchants" element={<Merchants />} />
                <Route path="/numbers" element={<Numbers />} />
                <Route path="/bkash_api" element={<Bkash />} />
                <Route path="/nagad_api" element={<Nagad />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payout" element={<Payout />} />
                <Route path="/point_of_sale" element={<Pointofsale />} />
                <Route path="/setting" element={<Profile />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/monthly" element={<Monthly />} />
                <Route path="/breakdown" element={<Breakdown />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/wallet_address" element={<Walletaddress />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/ticket" element={<Ticket_admin />} />
                <Route path="/reply-ticket/:id" element={<Replyticket />} />
                <Route path="/money_convertor" element={<Moneyconvertor />} />
                <Route path="/forwared_messages" element={<Forwaredmessage />} />
                <Route path="/merchant_details" element={<Merchanttable />} />
                <Route path="/merchant_details/:id" element={<Merchantdetails />} />
                <Route path="/admin_list" element={<Adminrole />} />
                <Route path="/create-new-user" element={<Createuser />} />
                <Route path="/agent_withdraw" element={<Agentwithdrawal/>} />

              </Route>
              <Route path="/checkout/:paymentId" element={<Checkoutmain />} />     
              {/* <Route path="/checkout/:paymentId" element={<Checkout />} />      */}
              <Route path="/p2p-deposit" element={<P2Pdepositpage />} />     
              <Route path="/withdraw-form"element={<WithdrawForm/>}/>
              <Route path="/depositdemo/:merchant" element={<Checkoutdemo />} />
              <Route path="/callbackbkash" element={<Callbackbkash />} />
              <Route path="/withdraw" element={<Withdraw/>}/>
              <Route path="/deposit-system" element={<Depositsystem/>} />
              <Route path="/deposit-system/bkash" element={<Bkashpament/>} />
              <Route path="/deposit-system/nagad" element={<Nagadpament/>} />
              {/* -------------------outside page----------------- */}
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/" element={<Homepage/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/api/docs" element={<Document />} />
              <Route path="*" element={<PageNotFound />} />
              {/* --------------------my code----------- */}
              {/* -------------------agent dashboard--------------- */}
              <Route path="/agent-registration" element={<Agentregistretion />} />
              <Route path="/agent-login" element={<Agentlogin />} />
              <Route path="/agent/waiting-for-approval"element={<Ageentapproval/>}/>
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
              <Route path="/agent-deposit-page" element={<Depositpage />} />
              <Route path="/agent-deposit-and-topup" element={<Depositandtopup />} />
              <Route path="/agent-withdraw" element={<Agentwithdraw />} />
              <Route path="/agent-report-and-analize" element={<Report />} />
              <Route path="/agent-create-ticket" element={<Ticket />} />
              <Route path="/view-ticket/:id" element={<Viewticket />} />
              <Route path="/new-ticket" element={<Newticket />} />
              <Route path="/agent-profile" element={<Agentprofile />} />
              <Route path="/agent" element={<Agent />} />
              <Route path="/agent-details/:id" element={<Agentdetails />} />
              <Route path="/sub_agent" element={<Pendingaggent />} />
              <Route path="/agent_deposit" element={<Agentdepositpage />} />
              <Route path="/agent-payout" element={<Agentpayout />} />
              <Route path="/add-bank" element={<Addbank />} />
              <Route path="/bank-account" element={<Bankaccount />} />
              <Route path="/agent-deposit-invoice/:id" element={<Depositinvoice />} />
               {/* --------------------testing user------------------- */}
              <Route path="/merchant-website" element={<Userprofile />} />
              <Route path="/merchant-user-signup" element={<Usersignup />} />
              <Route path="/merchant-user-login" element={<Userlogin />} />
            
               {/* --------------------testing user------------------- */}
            </Routes>
          </ThemeProvider>
          </Appprovider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
