import mongoose from "mongoose";

const Dollarschema = new mongoose.Schema(
  {
    currency_name:{
       type:String,
       required:true
    },
   price:{
    type:Number,
    required:true,
   }
  },
  { timestamps: true }
);

const Dollarmodel = mongoose.model("Dollar_price", Dollarschema);
export default Dollarmodel;