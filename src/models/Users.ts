import mongoose from "mongoose";
import { IUsers } from "../interfaces/IUsers";

const UsersSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  ispush: {
    type: Boolean,
    required: true,
  },
  firebaseToken : {
    type : String,
    required : true
  }
});

export default mongoose.model< IUsers & mongoose.Document>("Users", UsersSchema);
