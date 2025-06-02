import mongoose from "mongoose";

const WithdrawSchema = new mongoose.Schema(
  {
    agent_id:{
        type: String,
        required: true,
    },
    invoiceId:String,
    walletAddress: {
      type: String,
      required: true,
      minlength: 10,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Agentwithdraw=mongoose.model("AgentWithdrawal", WithdrawSchema);
export default Agentwithdraw;
