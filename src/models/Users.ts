import mongoose from "mongoose";


const UsersSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  ispush: {
    type: Boolean,
    required: true,
  }
});

export default mongoose.model< mongoose.Document>("Users", UsersSchema);
