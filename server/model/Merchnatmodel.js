import mongoose from "mongoose";

const merchant_schema = new mongoose.Schema(
  {
    player_id:String,
    user_name:String,
    balance:{
        type:Number,
        default:0,
    },
    bonus_balance:{
        type:Number,
        default:0,
    },
    merchant_name:String,
    website_url:String,
  },
  { timestamps: true }
);

const merchant_model = mongoose.model("Merchant_user", merchant_schema);
export default merchant_model;