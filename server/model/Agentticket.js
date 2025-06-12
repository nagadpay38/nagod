import mongoose from "mongoose"

const Ticket_Schema=new mongoose.Schema({
    ticket_id:{
        type:String,
        required:true
    },
    agent_id:{
        type:String,
        required:true
    },
        name:{
        type:String,
    },
        email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    department:{
      type:String,
      required:true
    },
   status:{
    type:String,
    default:"sent"
   },
   role:{
       type:String,
       required:true
   },
   remain_balance:{
       type:String,
   }
},{timestamps:true});

const agent_ticket_model=mongoose.model("Agent_ticket",Ticket_Schema);

export default agent_ticket_model;