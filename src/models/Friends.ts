import mongoose from "mongoose";


const FriendsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
    required : true
  },
  bookmark_id : {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Bookmarks",
    required : true
  },
  name : {
    type : String,
  },
  tier : {
    type : String,
  }

  
});

export default mongoose.model< mongoose.Document>("Users", FriendsSchema);
