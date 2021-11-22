import mongoose from "mongoose";
import { IFriends } from "../interfaces/IFriends";

const FriendsSchema = new mongoose.Schema({
  user_id: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
    required : true
  
  }],
  name : {
    type : String,
    required : true
  },
  tier : {
    type : String,
    default : "tier"
  },
  rank : {
    type : String,
  },
  win : {
    type : Number,
    default : 0
  },
  lose : {
    type : Number,
    default : 0
  },
  profileIconId : {
    type : Number,
  },
  puuid : {
    type : String,
  },
  lol_id : {
    type : String,
  },
  leaguePoint : {
    type : Number,
  }

  
});

export default mongoose.model< IFriends & mongoose.Document>("Friends", FriendsSchema);
