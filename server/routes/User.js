import express from "express"

const user_route=express();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import merchantuser_model from "../model/Merchantusermodel.js"
import PayoutTransaction from "../model/PayoutTransaction.js";
import ensureAuthenticated from "../middleware/auth2.js";
import merchant_model from "../model/Merchnatmodel.js";
import AgentNumber from "../model/AgentNumber.js";
import ForwardedSms from "../model/ForwardedSms.js";
import User from "../model/User.js";
import PayinTransaction from "../model/PayinTransaction.js";


// ----------merchant user profile
user_route.get("/checkout-page-agent/:mid", async (req, res) => {
  const { mid } = req.params;

  try {
    // Filter agents by `mid`
    const agents = await AgentNumber.find({ merchant:mid });
    const count = agents.length;

    if (count === 0) {
      return res.status(404).json({ message: "No agents found for the given MID" });
    }

    const random = Math.floor(Math.random() * count);
    const randomAgent = agents[random];

    console.log(randomAgent);
    res.status(200).json(randomAgent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch agent data" });
  }
});
user_route.get("/user-money-info/:id",async(req,res)=>{
    try {
        const user_money_info=await PayinTransaction.find({payerId:req.params.id,status:"fully paid",pament_status:"not_used"});
        let total_amount=0; 
        console.log(user_money_info)
        user_money_info.forEach((amoun)=>{
            total_amount=total_amount+amoun.expectedAmount;
         })
        const user_info=await merchant_model.findOne({player_id:req.params.id});
        // const update_user_money=await merchant_model.findByIdAndUpdate({_id:user_info._id},{$set:{balance:total_amount}})
        // if(update_user_money){
        //    const user_deposit=await PayinTransaction.updateMany({payerId:req.params.id,status:"fully paid",pament_status:"used"});
        // }
        res.send({success:true,message:"ok",data:user_info})
    } catch (error){
        console.log(error)
    }
})
user_route.post("/user-deposit",(req,res)=>{
    try {
       const {mid,payerid,amount}=req.body;
       console.log(amount)
    } catch (error) {
        console.log(error)
    }
});
user_route.post("/merchant-user-registration",async(req,res)=>{
    try {
        const {name,email, password,payer_id} = req.body;
        const user = await merchantuser_model.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        console.log(password)
        const userModel = new merchantuser_model({ name, email, password,payer_id});
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
            console.log(err)
    }
});
user_route.post("/merchant-user-login",async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await merchantuser_model.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.json({ message:"Email and Password did not match!", success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                     admin_data: user
            })
    } catch (err) {
        console.log(err)
        res.status(500)
            .json({
                message: err,
                success: false
            })
    }
});
// ----------forawared message
user_route.get("/messages", async (req, res) => {
  try {
         const messages=await ForwardedSms.find();
         res.send({success:true,message:"Ok",data:messages})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch message data" });
  }
});
user_route.get("/user-deposit-history/:id", async (req, res) => {
  try {
         const deposit_money=await PayinTransaction.find({payerId:req.params.id});
         res.send({success:true,message:"Ok",data:deposit_money})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch message data" });
  }
});
user_route.get("/user-withdraw-history/:id", async (req, res) => {
  try {
         const withdraw_money=await PayoutTransaction.find({payeeId:req.params.id});
         res.send({success:true,message:"Ok",data:withdraw_money})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch message data" });
  }
});
// ---------------------merchant----------------
user_route.get("/merchant", async (req, res) => {
  try {
    // Fetch all merchants
    const merchants = await User.find({ role: "merchant" });

    // Calculate total_deposit for each merchant
    const merchantsWithDeposit = await Promise.all(
      merchants.map(async (merchant) => {
        try {
          // Fetch transactions for this merchant
          const transactions = await PayinTransaction.find({ merchant: merchant.name,status:"fully paid"});
          const withdraw_transictions=await PayoutTransaction.find({merchant: merchant.name,status:"success"})
          // Manually calculate total deposit
         let total_deposit=0;
          transactions.forEach((data)=>{
             total_deposit=total_deposit+data.expectedAmount;
          });
        let total_withdraw=0; 
          console.log(`Total deposit for ${merchant.name}:`, total_deposit);
           withdraw_transictions.forEach((data)=>{
             total_withdraw=total_withdraw+data.requestAmount;
          });
          // Return updated merchant data
          return {
            ...merchant._doc, // Include all original merchant data
            total_deposit: total_deposit, 
            total_withdraw:total_withdraw,// Update total_deposit dynamically
          };
        } catch (err) {
          console.error(`Error fetching transactions for merchant ${merchant.name}:`, err);
          return { ...merchant._doc, total_deposit: 0 };
        }
      })
    );

    res.send({ success: true, message: "Ok", data: merchantsWithDeposit });
  } catch (error) {
    console.error("Error in /merchant route:", error);
    res.status(500).json({ error: "Failed to fetch merchant data" });
  }
});


user_route.get("/merchant-details/:id",async(req,res)=>{
    try {
        const merchant=await User.findOne({_id:req.params.id});
        const deposit=await PayinTransaction.find({merchant:merchant.name,status:"fully paid"});
        const withdraw=await PayoutTransaction.find({merchant:merchant.name,status:"success"});

        res.send({success:true,message:"Merchant has been deleted!",data:merchant,deposit,withdraw});
        console.log(merchant)
    } catch (error) {
        console.log(error)
    }
});
user_route.delete("/delete-merchant/:id",async(req,res)=>{
    try {
        const delete_merchant=await User.findByIdAndDelete({_id:req.params.id});
          res.send({success:true,message:"Merchant has been deleted!"})
    } catch (error) {
        console.log(error)
    }
});
// ---------------------merchant----------------
user_route.get("/admin-role", async (req, res) => {
  try {
   const admin_data=await User.find({role:"admin"});
      res.send({success:true,message:"ok",data:admin_data});   
  } catch (error) {
    console.error("Error in /merchant route:", error);
    res.status(500).json({ error: "Failed to fetch admin data" });
  }
});
user_route.delete("/delete-admin/:id",async(req,res)=>{
  try {
      const delete_admin=await User.findByIdAndDelete({_id:req.params.id});
      if(delete_admin){
        res.send({success:true,message:"Admin has been deleted!"})
      }
  } catch (error) {
      console.log(error)
  }
});
user_route.put("/admin-role-update/:id",async(req,res)=>{
  try {
    const update_admin_role=await User.findByIdAndUpdate({_id:req.params.id},{role:req.body.role,updated_by:req.body.admin_name},{new:true});
    if(update_admin_role){
       res.send({success:true,message:"Admin Role updated"})
    }
  } catch (error) {
      console.log(error)
  }
});
// ---------------------------find-transaction------------------------
user_route.get("/transaction-status/:id",async(req,res)=>{
  try {
    console.log(req.params.id)
    const find_transaction=await PayinTransaction.findOne({paymentId:req.params.id});
    if(!find_transaction){
        return res.send({success:false,message:"Transaction Not Found!"})
    }
    res.send({success:true,data:find_transaction})
  } catch (error) {
    console.log(error)
  }
})
export default user_route;