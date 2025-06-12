import mongoose from "mongoose";

const merchant_user_schema = new mongoose.Schema({
    name:{
           type:String,
            required:true
    },
           email:{
            type:String,
            required:true
           },
           password:{
            type:String,
            required:true
           },
           payer_id:{
                type:String,
                 required:true
           }
},{ timestamps: true });

const merchantuser_model = mongoose.model("Merchantuser", merchant_user_schema);
export default merchantuser_model;