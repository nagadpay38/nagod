import express from "express"
const agent_route=express.Router();
import multer from "multer";
import bcrypt from "bcryptjs"
import Agent_model from "../model/Agentregistration.js";
import agent_deposit_model from "../model/Agentdeposit.js";
import CC from 'currency-converter-lt';
import agent_ticket_model from "../model/Agentticket.js";
import PayinTransaction from "../model/PayinTransaction.js";
import Dollarmodel from "../model/Dollerprice.js";
import jwt from "jsonwebtoken"
import fs from "fs"
import mongoose from "mongoose"
import TelegramBot from 'node-telegram-bot-api';
const eassypay_agent_bot = new TelegramBot('7913236259:AAEwQ7ML-jSDK58_oojZVeHkIv0lfTYWCCY');
import crypto from "crypto"
import ensureAuthenticated from "../middleware/auth2.js";
import PayoutTransaction from "../model/PayoutTransaction.js";
import Agentwithdraw from "../model/Agentwithdrawmodel.js";
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/images")
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}_${file.originalname}`)
    }

});
const uploadimage=multer({storage:storage});
agent_route.post("/agent-registration",uploadimage.single("file"),async(req,res)=>{
    try {
        const {name,email,phone,password}=req.body;
        const find_agent=await Agent_model.findOne({accountNumber:phone});
        console.log(req.file)
        if(find_agent){
            res.send({success:false,message:"Agent Already Exist!"})
        }
        const match_name=await Agent_model.findOne({name:name});
        if(match_name){
          res.send({success:false,message:"Agent Name Already Exist!"})
      }
        if(!find_agent){
            const hash_pass=await bcrypt.hash(password,10);
            const new_agent=new Agent_model({
                name,email,password:hash_pass,accountNumber:phone,nid_or_passport:req.file.filename,account_type:"main"
            });
            if(new_agent){
            new_agent.save();
                     // Generate JWT token
        const jwtToken = jwt.sign(
          { email: new_agent.email, _id: new_agent._id },
          process.env.JWT_SECRET || "eassypay123@", // Use env variable for security
          { expiresIn: "24h" }
      );

      console.log("Generated JWT Token:", jwtToken);
      // Send success response with token & agent info
      return res.json({
          success: true,
          message: "Agent Registration Successful!",
          agent_info: new_agent,
          jwtToken
      });
            }
    
            res.send({success:false,message:"Somehting went wrong!"})
        }
    } catch (error) {
      console.log(error)
        console.log(error)
    }
});
// ----------------agent-information--------------------
agent_route.get("/agent-information/:id",async(req,res)=>{
  try {
      const find_agent=await Agent_model.findOne({_id:req.params.id});
      console.log(find_agent)
      if(!find_agent){
          return res.send({success:false,message:"Agent did not find!"})
      }
      res.send({success:true,message:"Ok",data:find_agent});
  } catch (error) {
    console.log(error)
  }
})
// -------------agent login

agent_route.post("/agent-login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Find agent by phone (accountNumber)
        const match_agent = await Agent_model.findOne({ accountNumber: phone });
        console.log(match_agent)
        if (!match_agent) {
            return res.json({ success: false, message: "Your phone number and password are incorrect!" });
        }

        // Compare passwords
        const compare_pass = await bcrypt.compare(password, match_agent.password);
        if (!compare_pass) {
            return res.json({ success: false, message: "Mobile Number and Password did not match!" });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: match_agent.email, _id: match_agent._id },
            process.env.JWT_SECRET || "eassypay123@", // Use env variable for security
            { expiresIn: "24h" }
        );

        console.log("Generated JWT Token:", jwtToken);

        // Send success response with token & agent info
        return res.json({
            success: true,
            message: "Login Successful!",
            agent_info: match_agent,
            jwtToken
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// --------------agent deposit
const generateInvoiceId = async () => {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  return `INV-${timestamp}-${randomNum}`;
};
agent_route.post("/agent-deposit-money",async(req,res)=>{
    try {
            const invoiceId = await generateInvoiceId();
         const {usdt_address,provider_name,amount,payer_number,transition_id,agent_id}=req.body;
         console.log(req.body)
         if(!usdt_address || !provider_name || !amount || !payer_number || !transition_id || !agent_id){
            res.send({success:false,message:"Please fill up your information!"})
         };
         const match_transiction=await agent_deposit_model.findOne({transiction_id:transition_id})
         if(match_transiction){
            res.send({success:false,message:"Transcition ID already exist!"})
         }
         const create_deposit=new agent_deposit_model({
            invoice_id:invoiceId,agent_number:usdt_address,provider_name,amount,payer_number,transiction_id:transition_id,agent_id
          });
          if(create_deposit){
            create_deposit.save();
            res.send({success:true,message:"Deposit created successul!"})
          }
    } catch (error) {
        console.log(error)
    }
});
// ------------------agent deposit histroy-------
agent_route.put("/agent-deposit-status/:id",async(req,res)=>{
    try {
      const find_agent_deposit=await agent_deposit_model.findById({_id:req.params.id});
      const doller_price=await Dollarmodel.findOne({currency_name:"dollar"});
      const match_agent=await Agent_model({_id:find_agent_deposit.agent_id})
      let change_the_bdt_amount=find_agent_deposit.amount*doller_price.price;
      const calculate_remaning_amount=match_agent.remaininglimit-change_the_bdt_amount;
      console.log("calculate_remaning_amount",calculate_remaning_amount)
      // if(calculate_remaning_amount < 0){
      //   console.log(match_agent.remaininglimit)
      //   return res.send({
      //     success:false,
      //     message: 'Agent Limit Is Sufficient!',
      //   });
      // }
      const update_deposit_history=await agent_deposit_model.findByIdAndUpdate({_id:req.params.id},{status:req.body.status,update_by:req.body.admin_name},{new:true});
      const user=await Agent_model.findById({_id:update_deposit_history.agent_id});
      let taka=update_deposit_history.amount;
      console.log("hello",change_the_bdt_amount)
   // If the status is 'fully paid', update the user's balance
     

    if (req.body.status === 'fully paid') { 
      user.balanceAmount += update_deposit_history.amount;
      user.balance_in_bdt+=change_the_bdt_amount;
      user.remaininglimit-=change_the_bdt_amount;
      user.remain_balance+=change_the_bdt_amount
      console.log("user limit",user.remaininglimit)
      await user.save();
      return res.status(200).json({
        success:true,
        message: 'Deposit status updated to fully paid and balance credited',
        balance: user.balance,
      });
    }
    console.log(update_deposit_history)
      if(update_deposit_history){
         res.send({success:true,message:"Status updated successful!"})
      }
    } catch (error) {
        console.log(error)
    }
});
// ---------------------------add-balance------------------------------
// PATCH route to update agent's balance (add/subtract or set)
agent_route.patch('/agents/:id/balance', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount,main_agent } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }
    const main_agent_info=await Agent_model.findById({_id:main_agent});
    if(!main_agent_info){
      return res.status(404).json({ message: 'Agent not found' });
    }

    if(main_agent_info.balance_in_bdt < amount){
      return res.status(404).json({success:false, message: 'Agent do not have suffieient balance!' })
    }
         if(main_agent_info.remain_balance < amount){
         return res.status(404).json({ success:false,message: 'You have already deposited!' })
    }
    // Find the agent
    const agent = await Agent_model.findById(id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    main_agent_info.remain_balance-=amount;
    agent.balance_in_bdt+=amount;
    main_agent_info.deposited_balance+=amount;
    agent.save();
    main_agent_info.save();
    res.status(200).json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// ------------update deposit histroy-----------
// --------------agent data------------
agent_route.get("/agent-data",async(req,res)=>{
    try {
        const all_agent=await Agent_model.find({account_type:"main"}).sort({ createdAt: -1 });
        const pending_agent=await Agent_model.find({account_type:"agent"}).sort({ createdAt: -1 });
        const agent_deposit_data=await agent_deposit_model.find().sort({ createdAt: -1 });
          res.send({success:true,agent:all_agent,pending_agent:pending_agent,agent_deposit_data})
    } catch (error) {
        console.log(error)
    }
});
// ------------single-agent-data-----------
agent_route.get("/single-agent-data/:id",async(req,res)=>{
  try {
      const agent_deposit_data=await agent_deposit_model.find({agent_id:req.params.id});
      console.log(agent_deposit_data)
        res.send({success:true,agent_deposit_data})
  } catch (error) {
      console.log(error)
  }
});
// -----------agent-withdraw---------------------
// Submit a withdrawal request
agent_route.post("/create-agent-withdraw", async (req, res) => {
  try {
    const { walletAddress, amount,agent_id } = req.body;

    if (!walletAddress || walletAddress.length < 10) {
      return res.status(400).json({ message: "Invalid wallet address" });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Enter a valid amount" });
    }

    // Generate an 8-character invoice ID
    const invoiceId = crypto.randomBytes(4).toString("hex").toUpperCase();

    const newWithdraw = new Agentwithdraw({ walletAddress, amount, invoiceId,agent_id });
    await newWithdraw.save();
     if(newWithdraw){
       const find_agent=await Agent_model.findOne({_id:agent_id});
       find_agent.commission-=amount;
       find_agent.save();
     }
    res.status(201).json({ success:true,message: "Withdrawal request submitted", invoiceId });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all withdrawals (for admin panel)
agent_route.get("/agent-all-withdraw", async (req, res) => {
  try {
    const withdrawals = await Agentwithdraw.find();
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch withdrawals" });
  }
});

// Update withdrawal status (Admin approval)
agent_route.get("/single-agent-withdraw/:id", async (req, res) => {
  try {
    const agent_withdraw=await Agentwithdraw.find({agent_id:req.params.id});
    res.json({ success: true, message: "Withdrawal status updated", data:agent_withdraw });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update status" });
  }
});
agent_route.put("/agent-withdraw-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    console.log(status)
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the withdrawal request
    const withdraw = await Agentwithdraw.findById(req.params.id);
    if (!withdraw) {
      return res.json({ message: "Withdrawal not found" });
    }

    // If status is rejected, refund the amount back to the agent
    if (status === "rejected") {
      const agent = await Agent_model.findOne({_id:withdraw.agent_id});
 
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      // Refund the amount
      agent.commission += withdraw.amount;
      await agent.save();
    }

    // Update withdrawal status
    withdraw.status = status;
    await withdraw.save();

    res.json({ success: true, message: "Withdrawal status updated", withdraw });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

// -----------update-agent-limit-amount--------------
// Update agent limit amounts
agent_route.put("/update-limit", async (req, res) => {
  const { agentId, limitAmount, remainingLimit } = req.body;

  if (!agentId || remainingLimit < 0) {
    return res.status(400).json({ message: "Invalid input values" });
  }

  try {
    const agent = await Agent_model.findByIdAndUpdate({_id:agentId},{$set:{limitAmount,remaininglimit:limitAmount}});
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json({ message: "Limits updated successfully", agent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// --------------agent details------------
agent_route.get("/agent-details/:id",async(req,res)=>{
    try {
        const agent_details=await Agent_model.findById({_id:req.params.id});
        if(!agent_details){
            res.send({success:false,message:"Something went wrong!"});
        }
          res.send({success:true,agent:agent_details})
    } catch (error) {
        console.log(error)
    }
});
agent_route.get("/agent-deposit/:id",async(req,res)=>{
    try {
        const agent_data=await agent_deposit_model.find({agent_id:req.params.id});
        const get_full_amount=await agent_deposit_model.find({agent_id:req.params.id,status:"fully paid"});
        let total_amount=0; 
        get_full_amount.forEach((amoun)=>{
            total_amount=total_amount+amoun.amount;
         })
        if(!agent_data){
            res.send({success:false,message:"Something went wrong!"});
        }
        const agent_information = await Agent_model.findOne({_id:req.params.id});
        if(!agent_information){
            res.send({success:false,message:"No Agent Information found"});
        }
        const find_agent_withdraw=await PayinTransaction.find({ agentAccount: agent_information?.accountNumber });
        let total_withdraw=0;
           find_agent_withdraw.forEach((amoun)=>{
           total_withdraw=total_withdraw+amoun.expectedAmount;
         });
         console.log(agent_information)
        let remaining_amount=agent_information.limitAmount-total_withdraw;
        let usdt=agent_information.balanceAmount;
         let currencyConverter = new CC({
      from: "USD",
      to: "INR",
      amount: 100 // example amount to convert
    });
       console.log(total_amount)
       const doller_price=await Dollarmodel.findOne({currency_name:"dollar"});
       
       console.log(doller_price.price)
       let change_the_bdt_amount=total_amount*doller_price.price;
        const total_commission=Math.floor((change_the_bdt_amount/100)*2);
       console.log(change_the_bdt_amount)
    // Perform the conversion
        const conversionResult = await currencyConverter.convert();
        // const update_agent_deposit_amount=await Agent_model.findByIdAndUpdate({_id:req.params.id},{$set:{balance_in_bdt:change_the_bdt_amount}})
        const update_agent_remaining_amount=await Agent_model.findByIdAndUpdate({_id:req.params.id},{$set:{limitRemaining:remaining_amount}})
        res.send({success:true,data:agent_data,total_amount_of_deposit:total_amount,total_commission,agent_information,find_agent_withdraw})
    } catch (error) {
        console.log(error)
    }
});
// ------------update agent-------------
agent_route.put("/admin/agent-update/:id",async(req,res)=>{
    try {
      console.log(req.body)
      const find_agent=await Agent_model.findOne({_id:req.params.id})
        if(!find_agent){
            return res.send({success:false,message:"Something went wrong!"});
        }
        const agent_details=await Agent_model.findByIdAndUpdate({_id:find_agent._id},{$set:{status:"activated",update_by:req.body.admin_name,commission_rate:req.body.commission_rate}});
          res.send({success:true,message:"Agent has been approved!"})
    } catch (error) {
        console.log(error)
    }
});
agent_route.put("/agent-update/:id",async(req,res)=>{
    try {
      console.log(req.body)
      const find_agent=await Agent_model.findOne({_id:req.params.id})
        if(!find_agent){
            return res.send({success:false,message:"Something went wrong!"});
        }
        const agent_details=await Agent_model.findByIdAndUpdate({_id:find_agent._id},{$set:{status:req.body.status,update_by:req.body.admin_name,commission_rate:req.body.commission_rate,withdraw_commission_rate:req.body.withdraw_commission_rate}});
          res.send({success:true,message:"Agent has been approved!"})
    } catch (error) {
        console.log(error)
    }
});
// delete agent
agent_route.delete("/agent-delete/:id",async(req,res)=>{
    try {
        const agent_details=await Agent_model.findByIdAndDelete({_id:req.params.id});
          res.send({success:true,message:"Agent has been deleted!"})
            if(agent_details){
                  fs.unlinkSync(`./public/images/${agent_details.nid_or_passport}`)
                  res.send({success:true,message:"Product has been deleted!"})
         }
    } catch (error) {
        console.log(error)
    }
});
// ----------------agent-deposit-details--------------------
agent_route.delete("/agent-deposit-history-delete/:id",async(req,res)=>{
    try {
        const agent_details=await agent_deposit_model.findByIdAndDelete({_id:req.params.id});
          res.send({success:true,message:"Agent has been deleted!"})
    } catch (error) {
        console.log(error)
    }
});
// -----------agent ticket-------------
agent_route.post("/agent-ticket", async (req, res) => {
  try {
    const { ticket_id, agent_id, supportOption, name, email, message, role } = req.body;

    // Validate required fields
    if (!ticket_id || !name || !email || !message || !agent_id || !supportOption || !role) {
      return res.send({ success: false, message: "Please fill up your message!" });
    }

    // Check if ticket ID already exists
    const findTicket = await agent_ticket_model.findOne({ ticket_id });
    if (findTicket) {
      return res.send({ success: false, message: "Ticket ID Already Exist!" });
    }

    // Create a new ticket
    const createTicket = new agent_ticket_model({
      ticket_id,
      agent_id,
      name,
      email,
      message,
      role,
      department: supportOption,
    });

    // Save the ticket
    if (createTicket) {
      await createTicket.save();

      // Create the payload message with improved formatting
      const ticketPayload =
        "🎟️ <b>New Agent Support Ticket Created!</b> 🎟️\n" +
        "\n" +
        "🆔 <b>Ticket ID:</b> <code>" + ticket_id + "</code>\n" +
        "👤 <b>Agent ID:</b> <code>" + agent_id + "</code>\n" +
        "📂 <b>Support Option:</b> <code>" + supportOption + "</code>\n" +
        "📧 <b>Email:</b> <code>" + email + "</code>\n" +
        "📝 <b>Message:</b>\n" +
        "<i>" + message + "</i>\n" +
        "📄 <b>Role:</b> <code>" + role + "</code>\n";

      // Send the payload to the bot
      eassypay_agent_bot.sendMessage(7920367057, ticketPayload, {
        parse_mode: "HTML", // Use HTML formatting
      });

      // Respond to the client
      res.send({ success: true, message: "Ticket Created Successfully!" });
    }
  } catch (error) {
    console.error("Error in /agent-ticket route:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});


// -------------------ticket data----------------
agent_route.get("/agent-ticket/:id",async(req,res)=>{
    try {
      const ticket_info=await agent_ticket_model.find({agent_id:req.params.id});
      res.send({success:true,ticket:ticket_info})
    } catch (error) {
        console.log(error)
    }
});
// ----------------reply the ticket from agent
agent_route.post("/agent-reply",async(req,res)=>{
    try {
            const {ticket_id,name,message,role}=req.body;
            if(!ticket_id || !message || !role){
                res.send({success:false,message:"Please fill up your message!"});
            }
            const find_ticketid=await agent_ticket_model.findOne({ticket_id:ticket_id});
            if(!find_ticketid){
                    return   res.send({success:false,message:"Ticket ID Is Not Exist!"});
            }
            if(role=="agent"){
          const create_ticket=new agent_ticket_model({ticket_id,agent_id:find_ticketid.agent_id,name:find_ticketid.name,email:find_ticketid.email,message,role,department:find_ticketid.department});
            if(create_ticket){
                 create_ticket.save();
                 res.send({success:true,message:"Reply Created Successful!"})
            }
            }else{
                const create_ticket=new agent_ticket_model({ticket_id,agent_id:find_ticketid.agent_id,name:name,email:find_ticketid.email,message,role,department:find_ticketid.department});
                if(create_ticket){
                 create_ticket.save();
                 res.send({success:true,message:"Reply Created Successful!"})
            }
            }
          
    } catch (error) {
        console.log(error)
    }
});
// -------------view ticket
agent_route.get("/view-ticket/:id",async(req,res)=>{
    try {
      const ticket_info=await agent_ticket_model.findOne({_id:req.params.id});
      res.send({success:true,ticket:ticket_info})
    } catch (error) {
        console.log(error)
    }
});
agent_route.post("/dollar-price",(req,res)=>{
    try {
         const {price}=req.body;
         const set_dollar_price=new Dollarmodel({
            price
         });
         if(set_dollar_price){
            set_dollar_price.save();
              res.send({success:true,message:"Dollar price added!"})
         }
    } catch (error) {
        console.log(error)
    }
});

agent_route.post("/currency-price",(req,res)=>{
    try {
         const {price,currency_name}=req.body;
         const set_dollar_price=new Dollarmodel({
            price,
            currency_name
         });
         if(set_dollar_price){
            set_dollar_price.save();
              res.send({success:true,message:"Dollar price added!"})
         }
    } catch (error) {
        console.log(error)
    }
});
agent_route.delete("/currency-romove/:id",async(req,res)=>{
    try {
        const count_doller_price=await Dollarmodel.find({currency_name:"dollar"}).count();
        if(count_doller_price > 1){
           await Dollarmodel.findByIdAndDelete({_id:req.params.id});
           res.send({success:true,message:"Doller price has been deleted!"})
        }
        res.send({success:false,message:"You can not delete this currency!"})
    } catch (error) {
        console.log(error)
    }
})
agent_route.get("/currency-price",async(req,res)=>{
    try {
      const find_price=await Dollarmodel.find();
      console.log(find_price)
        res.send({success:true,message:"okkk",data:find_price})
    } catch (error) {
        console.log(error)
    }
});
// --------------------------agent ticket----------------
agent_route.get("/agent-ticket-data", async (req, res) => {
  try {
         const ticket=await agent_ticket_model.find();
         res.send({success:true,message:"Ok",data:ticket})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch message data" });
  }
});
agent_route.get("/agent-ticket-data/:id", async (req, res) => {
  try {
    console.log(req.params.id)
         const ticket=await agent_ticket_model.find({ticket_id:req.params.id});
         res.send({success:true,message:"Ok",data:ticket})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch message data" });
  }
});

agent_route.get("/invoice-details/:id",async(req,res)=>{
    try {
         const find_invoice=await agent_deposit_model.findOne({_id:req.params.id});
         res.send({success:true,message:"Ok",data:find_invoice});
    } catch (error) {
        console.log(error)
    }
})

// ---------------------total-deposit-by-agent--------------------
agent_route.get("/single-agent-cashin/:id",async(req,res)=>{
  try {
     const all_deposit=await PayinTransaction.find({agentAccount:req.params.id});
     if(!all_deposit){
      return res.send({success:false,message:"Agent Did Not Find!"})
     }
     res.send({success:true,message:"Ok",data:all_deposit})
  } catch (error) {
    console.log(error)
  }
});

agent_route.get("/single-agent-cashout/:id",async(req,res)=>{
  try {
    console.log(req.params.id)
     const all_withdraw=await PayoutTransaction.find({agent_account:req.params.id});
     console.log(all_withdraw)
     if(!all_withdraw){
      return res.send({success:false,message:"Agent Did Not Find!"})
     }
     res.send({success:true,message:"Ok",data:all_withdraw})
  } catch (error) {
    console.log(error)
  }
});


agent_route.get('/agents/:agent_id/withdrawal-requests', async (req, res) => {
  try {
    const { agent_id } = req.params;
    const { 
      status, 
      currency,
      startDate, 
      endDate, 
      page = 1, 
      limit = 20 
    } = req.query;

    // Validate agent_id
    if (!mongoose.Types.ObjectId.isValid(agent_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID format'
      });
    }

    // Build the match filter for the aggregation
    const matchFilter = {};
    
    // Add status filter if provided
    if (status) {
      if (!['pending', 'approved', 'rejected', 'completed', 'failed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
      matchFilter['withdrawalRequests.status'] = status;
    }

    // Add currency filter if provided
    if (currency) {
      if (!['USD', 'BDT'].includes(currency)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid currency value'
        });
      }
      matchFilter['withdrawalRequests.currency'] = currency;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      matchFilter['withdrawalRequests.date'] = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid start date format. Use YYYY-MM-DD'
          });
        }
        matchFilter['withdrawalRequests.date'].$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid end date format. Use YYYY-MM-DD'
          });
        }
        end.setHours(23, 59, 59, 999);
        matchFilter['withdrawalRequests.date'].$lte = end;
      }
    }

    // Calculate pagination values
    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (parsedPage - 1) * parsedLimit;

    // Aggregation pipeline to filter and paginate withdrawalRequests
    const result = await Agent_model.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(agent_id)
        }
      },
      {
        $unwind: "$withdrawalRequests"
      },
      {
        $match: matchFilter
      },
      {
        $sort: { "withdrawalRequests.date": -1 } // Newest first
      },
      {
        $group: {
          _id: "$_id",
          withdrawalRequests: { $push: "$withdrawalRequests" },
          totalCount: { $sum: 1 }
        }
      },
      {
        $project: {
          withdrawalRequests: {
            $slice: ["$withdrawalRequests", skip, parsedLimit]
          },
          totalCount: 1
        }
      }
    ]);

    if (result.length === 0) {
      // Agent exists but has no matching withdrawal requests
      const agentExists = await Agent_model.exists({ _id: agent_id });
      if (!agentExists) {
        return res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
      }

      return res.json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: parsedPage,
          pages: 0,
          limit: parsedLimit
        }
      });
    }

    const agentData = await Agent_model.findById(agent_id)
      .select('name email accountNumber balance_in_dollar balance_in_bdt');

    return res.json({
      success: true,
      data: result[0].withdrawalRequests,
      pagination: {
        total: result[0].totalCount,
        page: parsedPage,
        pages: Math.ceil(result[0].totalCount / parsedLimit),
        limit: parsedLimit
      },
      agent: {
        id: agent_id,
        name: agentData.name,
        email: agentData.email,
        accountNumber: agentData.accountNumber,
        balances: {
          usd: agentData.balance_in_dollar,
          bdt: agentData.balance_in_bdt
        }
      }
    });

  } catch (error) {
    console.error('Error fetching agent withdrawal requests:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching withdrawal requests',
      error: error.message
    });
  }
});


// Get agent data with withdrawal requests by agent_id
agent_route.get('/agent-withdrawal-data/:agent_id', async (req, res) => {
  try {
    const { agent_id } = req.params;
    console.log(agent_id)
    // Validate agent_id
    if (!mongoose.Types.ObjectId.isValid(agent_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID format'
      });
    }

    // Find agent with withdrawalRequests
    const agent = await Agent_model.findById(agent_id)
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    console.log("first",agent)

    // Sort withdrawalRequests by date in descending order (newest first)
    const sortedWithdrawalRequests = [...agent.withdrawalRequests].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // Calculate total pending withdrawal amount from sorted requests
    const pendingWithdrawals = sortedWithdrawalRequests.filter(req => req.status === 'pending');
    const totalPending = pendingWithdrawals.reduce((sum, req) => sum + req.amount, 0);

    // Prepare response data
    const responseData = {
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        accountNumber: agent.accountNumber,
        status: agent.status,
        balances: {
          usd: agent.balance_in_dollar,
          bdt: agent.balance_in_bdt,
          commission: agent.commission
        },
        limits: {
          total: agent.limitAmount,
          remaining: agent.remaininglimit
        },
        rates: {
          deposit_commission: agent.commission_rate,
          withdraw_commission: agent.withdraw_commission_rate
        },
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt
      },
      withdrawalSummary: {
        totalRequests: sortedWithdrawalRequests.length,
        pendingCount: pendingWithdrawals.length,
        totalPendingAmount: totalPending
      },
      withdrawalRequests: sortedWithdrawalRequests // Use the sorted array
    };
   
    console.log("w2weqwe",responseData)
    return res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching agent withdrawal data:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching agent data',
      error: error.message
    });
  }
});
export default agent_route