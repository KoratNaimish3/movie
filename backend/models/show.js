import mongoose from "mongoose";

const showSchema = new mongoose.Schema({

   movie:{
    type:String,
    ref:"Movie",
   },

   showDateTime:{
      type:Date,
      require:true
   },

   showPrice:{
     type:Number,
      require:true
   },

   occupiedSeats:{
      type:Object,
      default:{}
   }

}, { minimize: false })

const Show = mongoose.model("show", showSchema)
export default Show