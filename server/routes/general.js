import express from "express";
import {
  fetchUser,
  getDashboardStats,
  getChartStats,
  getPieStats,
  signin,
  signup,
  addUser,
  updateUser,
  updatePassword,
  deleteUser,
  addAgentNumber,
  updateAgentNumber,
  deleteAgentNumber,
  addApiAccountBkash,
  updateApiAccountBkash,
  deleteApiAccountBkash,
  deletePayinTransaction,
  addApiAccountNagad,
  updateApiAccountNagad,
  deleteApiAccountNagad,
} from "../controllers/general_controller.js";
import WalletAddress from "../model/WalletAddress.js";
import Agent_model from "../model/Agentregistration.js";

const router = express.Router();

// User management routes
router.get("/user/:id", fetchUser);
router.get("/dashboard", getDashboardStats);
router.get("/chart", getChartStats);
router.get("/pie", getPieStats);
router.post("/addUser", addUser);
router.post("/updateUser", updateUser);
router.post("/updatePassword", updatePassword);
router.post("/deleteUser", deleteUser);

// Agent number management routes
router.post("/addAgentNumber", addAgentNumber);
router.post("/updateAgentNumber", updateAgentNumber);
router.post("/deleteAgentNumber", deleteAgentNumber);

// Bkash API account management routes
router.post("/addApiAccountBkash", addApiAccountBkash);
router.post("/updateApiAccountBkash", updateApiAccountBkash);
router.post("/deleteApiAccountBkash", deleteApiAccountBkash);


// Nagad API account management routes
router.post("/addApiAccountNagad", addApiAccountNagad);
router.post("/updateApiAccountNagad", updateApiAccountNagad);
router.post("/deleteApiAccountNagad", deleteApiAccountNagad);

// Transaction management routes
router.post("/deletePayinTransaction", deletePayinTransaction);
// GET - fetch the first (or only) wallet
router.get('/walletaddress', async (req, res) => {
  try {
    const wallet = await WalletAddress.findOne().sort({ createdAt: -1 });
    res.json({success:true,data:wallet});
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - create wallet
router.post('/walletaddress', async (req, res) => {
  try {
    const { btcAddress, usdtAddress, network, note } = req.body;

    const exists = await WalletAddress.findOne();
    // if (exists) {
    //   return res.status(400).json({ message: 'Wallet already exists. Use PUT to update.' });
    // }

    const newWallet = new WalletAddress({ btcAddress, usdtAddress, network, note });
    const saved = await newWallet.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - update wallet (by ID)
router.put('/walletaddress/:id', async (req, res) => {
  try {
    const updated = await Walleta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('PUT error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Create a new agent
router.post('/agents', async (req, res) => {
  try {
    const agentData = req.body;
    console.log(req.body);
    
    // Check if email already exists
    const existingAgent = await Agent_model.findOne({ email: agentData.email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Email already in use' });
    }
     const main_agent=await Agent_model.findById({_id:req.body.createdby_id})  
    // Add account_type to the agentData
    const agentWithAccountType = {
      ...agentData,
      account_type: 'agent', // or whatever value you want to set
           limitRemaining:req.body.limitAmount,
           commission_rate:main_agent.commission_rate,
           withdraw_commission_rate:main_agent.withdraw_commission_rate,
    };

    const newAgent = new Agent_model(agentWithAccountType);
    const savedAgent = await newAgent.save();
    
    res.status(201).json(savedAgent);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});
router.post('/bkash-api', async (req, res) => {
  try {
    const agentData = req.body;

    // Check if email already exists
    const existingAgent = await Agent_model.findOne({ email: agentData.email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create the new agent using spread operator to flatten the fields
    const newAgent = new Agent_model({
      ...agentData,
      api_account: true,
      status: "deactivated",
            account_type: 'agent', // or whatever value you want to set
      limitRemaining: agentData.limitAmount
    });

    const savedAgent = await newAgent.save();

    res.status(201).json(savedAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/nagad-api', async (req, res) => {
  try {
    const agentData = req.body;

    // Check if email already exists
    const existingAgent = await Agent_model.findOne({ email: agentData.email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create the new agent using spread operator
    const newAgent = new Agent_model({
      ...agentData,
      api_account: true,
      mfs: "nagad",
      status: "deactivated",
            account_type: 'agent', // or whatever value you want to set
      limitRemaining: agentData.limitAmount
    });

    const savedAgent = await newAgent.save();

    res.status(201).json(savedAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/all-agent/:id', async (req, res) => {
  try {
    const agents = await Agent_model.find({createdby_id:req.params.id}).sort({ createdAt: -1 });
    res.json({success:true,data:agents});
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
