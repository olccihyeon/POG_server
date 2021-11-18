import mongoose from "mongoose";

export interface IUsers {
   device_id : String,
   ispush : Boolean,
   firebaseToken : String
}
