import express from "express";
import { readlink } from "fs/promises";
const app = express();
import connectDB from "./Loaders/db";
import Friend from "./models/Friends";
const schedule = require("node-schedule");
var request = require("request");

const key = "RGAPI-1402667a-c381-48e2-81b1-f47c84d54f84"
// const rule = new schedule.RecurrenceRule();
// rule.tz = "Asia/Seoul";
// rule.hour = 17;
// rule.minute = 15;
// rule.second = 0;

//fire base
// const admin = require("firebase-admin");
// let serviceAccount = require("../bium-sever-firebase-adminsdk-y6tzj-9f976cbf9b.json");



// schedule.scheduleJob(rule, async () => {
//   try {
//     // if (!admin.apps.length) {
//     //   admin.initializeApp({
//     //     credential: admin.credential.cert(serviceAccount),
//     //   });
//     // }

//     const friends = await Friend.find();
//     console.log(friends[0]);
//   } catch (err) {
//     console.log(err);
//   }
// });
schedule.scheduleJob('10 * * * * *',  async () => {
   
    try {      
      const friends = await Friend.find();
      const cnt = await Friend.find().count();
      
      for( var i = 0 ; i<cnt ; i++)
      {
        var url_id = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+friends[i].lol_id+"?api_key="+key
        const name = friends[i].name
        const rank=friends[i].rank
        const tier = friends[i].tier
        const lose = friends[i].lose
        const win = friends[i].win
        await request(url_id, async function(err, res, body){
          var info_json = JSON.parse(body);
          
          if(info_json.length == 0)
          {
             console.log("솔로랭크 유저가 아닙니다.")
          }
          else if(info_json[0].queueType == 'RANKED_SOLO_5x5')
          {
            console.log(info_json[0].losses)
            console.log(info_json[0].wins)
            if((info_json[0].losses - Number(lose)) ==1)
            {
              console.log("최근 경기를 패배하셨습니다.")
              if(info_json[0].rank!=rank)
              {
                console.log("강등도 당하셨네요")
              }

            }
            else if((info_json[0].wins- Number(win)) ==1)
            {
              console.log("최근 경기를 승리하셨습니다.")
              if(info_json[0].rank!=rank)
              {
                console.log("승급하셨네요")
              }
            }
            else if((info_json[0].wins - Number(win)) ==0)
            {
              console.log("최근 경기가 없었습니다.")
            }
            await Friend.update({
              name : name
            },
            {
              $set: {
                lose : info_json[0].losses,
                win : info_json[0].wins,
                tier : info_json[0].tier,
                rank : info_json[0].rank
              }
            })
           
            
          }
          else{
            if((info_json[0].losses - Number(lose)) ==1)
            {
              console.log("최근 경기를 패배하셨습니다.")
              if(info_json[1].rank!=rank)
              {
                console.log("강등도 당하셨네요")
              }

            }
            else if((info_json[0].wins - Number(win)) ==1)
            {
              console.log("최근 경기를 승리하셨습니다.")
              if(info_json[1].rank!=readlink)
              {
                console.log("승급하셨네요")
              }
            }
            else if((info_json[0].wins - Number(win)) ==0)
            {
              console.log("최근 경기가 없었습니다.")
            }
            await Friend.update({
              name : name
            },
            {
              $set: {
                lose : info_json[0].losses,
                win : info_json[0].wins,
                tier : info_json[1].tier,
                rank : info_json[1].rank
              }
            })
          }
        });         
      }
    }catch (err) {
      console.log(err);
    }
  });



// Connect Database
connectDB();

app.use(express.json());

// Define Routes
app.use("/users", require("./api/users"));
app.use("/friends", require("./api/friend"));


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app // [5]
  .listen(5000, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: 5000 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
