import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ["USD", "BDT"],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed", "failed","fully paid","success"],
    default: "pending"
  },
  method: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ""
  },
  processedBy: {
    type: String,
    default: ""
  },
  // Additional fields for withdrawal requests
  merchantReference: {
    type: String,
    default: ""
  },
  agent_number:{
    type: String,
  },
  merchantId: {
    type: String,
    default: ""
  },
  withdrawalDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String,
    branchName: String,
    routingNumber: String
  },
  isWithdrawalRequest: {
    type: Boolean,
    default: false
  },
  payeeAccount:{
        type: String,
  }
});

const Agent_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nid_or_passport: {
    type: String,
  },
  status: {
    type: String,
    default: "deactivated"
  },
  balanceAmount: {
    type: Number,
    default: 0
  },
  balance_in_dollar: {
    type: Number,
    default: 0     
  },
  balance_in_bdt: {
    type: Number,
    default: 0     
  },
  limitAmount: {
    type: Number,
    default: 0
  },
  remaininglimit: {
    type: Number,
    default: 0
  },
  limitRemaining: {
    type: Number,
    default: 0
  },
  merchant_name: {
    type: String,
    default: ""
  },
  update_by: {
    type: String,
    default: ""
  },
  commission_rate: {
    type: Number,
    default: 0
  },
  withdraw_commission_rate: {
    type: Number,
    default: 0
  },
  commission: {
    type: Number,
    default: 0
  },
  mfs: {
    type: String,
  },
  deposits: {
    type: [TransactionSchema],
    default: []
  },
  withdrawals: {
    type: [TransactionSchema],
    default: []
  },
  withdrawalRequests: {  // New field specifically for withdrawal requests
    type: [TransactionSchema],
    default: []
  },
  accountName: String,
  accountNumber: String,
  username: String,
  password: String,
  appKey: String,
  appSecretKey: String,
  api_account: {
    type: Boolean,
    default: false
  },
  account_type: String,
  createdby_id: String,
  remain_balance: {
    type: Number,
    default: 0
  },
  deposited_balance: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Agent_model = mongoose.model("Agent", Agent_schema);
export default Agent_model;