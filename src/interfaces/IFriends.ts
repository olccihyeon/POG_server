import mongoose from "mongoose";

export interface IFriends {
  user_id: [mongoose.Types.ObjectId];
  name: String;
  tier : String;
  rank : String;
  win : Number;
  lose : Number;
  profileIconId : Number;
  puuid : String;
  lol_id : String;
}
