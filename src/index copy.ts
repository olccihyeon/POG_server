// import express from "express";
// import { readlink } from "fs/promises";
// const app = express();
// import connectDB from "./Loaders/db";
// import Friend from "./models/Friends";
// import User from "./models/Users";
// const schedule = require("node-schedule");
// var request = require("request-promise-native");

// const key = "RGAPI-1402667a-c381-48e2-81b1-f47c84d54f84"

// const admin = require('firebase-admin')
// let serAccount = require('../pog-player-of-the-game-firebase-adminsdk-ed8a5-ed5793a629.json')

// admin.initializeApp({
//   credential: admin.credential.cert(serAccount),
// })
// schedule.scheduleJob('10 * * * * *',  async () => {
//     try {      
//       const friends = await Friend.find();
//       const cnt = await Friend.find().count();
      
//       for( var i = 0 ; i<cnt ; i++)
//       {
//         var url_id = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+friends[i].lol_id+"?api_key="+key
//         const name = friends[i].name
//         const rank=friends[i].rank
//         const tier = friends[i].tier
//         const lose = friends[i].lose
//         const win = friends[i].win
//         const info = await request( url_id , async function(err, res, body){});
//         var info_json = await JSON.parse(info);
//         if(info_json.length == 0)
//         { 
//             console.log("솔로랭크 유저가 아닙니다.")
          
//         }
//         else if(info_json[0].queueType == 'RANKED_SOLO_5x5')
//         {
        
//           if((info_json[0].losses - Number(lose)) ==1)
//           {
//             console.log("최근 경기를 패배하셨습니다.")
            
            
//             const friends = await Friend.findOne({name : name});
//             const result = [];
//             for (let i = 0; i < friends.user_id.length; ++i) {
//               const uid = await User.findOne({_id : friends.user_id[i]});
//               result.push(String(uid.firebaseToken));
//             }
//             if(info_json[0].rank!=rank)
//             {
//               let message = {
//                 notification: {
//                   title: "전적 및 승급 알림",
//                   body: name + "님이 최근 게임에서 패배하며 강등당했습니다."
//                 },
//               };
//               admin
//               .messaging()
//               .sendToDevice(result, message)
//               .then(function (response) {
//                 console.log("Successfully sent message: : ", response);
//               })
//               .catch(function (err) {
//                 console.log("Error Sending message!!! : ", err);
//               });
//             }
//           else{
//             let message = {
//               notification: {
//                 title: "전적 및 승급 알림",
//                 body: name + "님이 최근 게임에서 패배했습니다."
//               },
//             };
//             admin
//             .messaging()
//             .sendToDevice(result, message)
//             .then(function (response) {
//               console.log("Successfully sent message: : ", response);
//             })
//             .catch(function (err) {
//               console.log("Error Sending message!!! : ", err);
//             });
//           }
              
          
//             }
//             else if((info_json[0].wins- Number(win)) ==1)
//             {
//               console.log("최근 경기를 승리하셨습니다.")
                
//               const friends = await Friend.findOne({name : name});
//               const result = ['cOeWpFvwIU4Ih5zTh3Yasg:APA91bGO8leAvAI3OebMYNucOsAHkrmDRHgcGeAwoHEp1Yva5aAd8WoJ3sPrXgntiwWB0Hkf2gK9CWqvjftN_jUAVbHU_R_Uak-2791J5djmn0qJePl8al6-1d3jYFJBbeQNnMITPkz9'];
//               for (let i = 0; i < friends.user_id.length; ++i) {
//                 const uid = await User.findOne({_id : friends.user_id[i]});
//                 result.push(String(uid.firebaseToken));
//               }
//               if(info_json[0].rank!=rank)
//               {
//                 let message = {
//                   notification: {
//                     title: "전적 및 승급 알림",
//                     body: name + "님이 최근 게임에서 승리하며 승급했습니다."
//                   },
//                 };
//                 admin
//                 .messaging()
//                 .sendToDevice(result, message)
//                 .then(function (response) {
//                   console.log("Successfully sent message: : ", response);
//                 })
//                 .catch(function (err) {
//                   console.log("Error Sending message!!! : ", err);
//                 });
//               }
//               else{
//                 let message = {
//                   notification: {
//                     title: "전적 및 승급 알림",
//                     body: name + "님이 최근 게임에서 승리했습니다."
//                   },
//                 };
//                 admin
//                 .messaging()
//                 .sendToDevice(result, message)
//                 .then(function (response) {
//                   console.log("Successfully sent message: : ", response);
//                 })
//                 .catch(function (err) {
//                   console.log("Error Sending message!!! : ", err);
//                 });
//               }
//             }
//             else if((info_json[0].wins - Number(win)) ==0)
//             {
//               console.log("최근 경기가 없었습니다.")
//             }
//             await Friend.update({
//               name : name
//             },
//             {
//               $set: {
//                 lose : info_json[0].losses,
//                 win : info_json[0].wins,
//                 tier : info_json[0].tier,
//                 rank : info_json[0].rank,
//                 leaguePoint : info_json[0].leaguePoints,
//               }
//             })
           
            
//           }
//           else{
//             if((info_json[1].losses - Number(lose)) ==1)
//             {
//               console.log("최근 경기를 패배하셨습니다.")
               
//               const friends = await Friend.findOne({name : name});
//               const result = [];
//               for (let i = 0; i < friends.user_id.length; ++i) {
//                 const uid = await User.findOne({_id : friends.user_id[i]});
//                 result.push(String(uid.firebaseToken));
//               }
//               if(info_json[1].rank!=rank)
//               {
//                 let message = {
//                   notification: {
//                     title: "전적 및 승급 알림",
//                     body: name + "님이 최근 게임에서 패배하며 강등당했습니다."
//                   },
//                 };
//                 admin
//                 .messaging()
//                 .sendToDevice(result, message)
//                 .then(function (response) {
//                   console.log("Successfully sent message: : ", response);
//                 })
//                 .catch(function (err) {
//                   console.log("Error Sending message!!! : ", err);
//                 });
//               }
//               else{
//                 let message = {
//                   notification: {
//                     title: "전적 및 승급 알림",
//                     body: name + "님이 최근 게임에서 패배했습니다."
//                   },
//                 };
//                 admin
//                 .messaging()
//                 .sendToDevice(result, message)
//                 .then(function (response) {
//                   console.log("Successfully sent message: : ", response);
//                 })
//                 .catch(function (err) {
//                   console.log("Error Sending message!!! : ", err);
//                 });
//               }

//             }
//             else if((info_json[1].wins - Number(win)) ==1)
//             {
//               console.log("최근 경기를 승리하셨습니다.")
//               const friends = await Friend.findOne({name : name});
//               const result = [];
//               for (let i = 0; i < friends.user_id.length; ++i) {
//                 const uid = await User.findOne({_id : friends.user_id[i]});
//                 result.push(String(uid.firebaseToken));
//               }
//               if(info_json[1].rank!=rank)
//               {
//                 let message = {
//                   notification: {
//                     title: "전적 및 승급 알림",
//                     body: name + "님이 최근 게임에서 승리하며 승급했습니다."
//                   },
//                 };
//                 admin
//                 .messaging()
//                 .sendToDevice(result, message)
//                 .then(function (response) {
//                   console.log("Successfully sent message: : ", response);
//                 })
//                 .catch(function (err) {
//                   console.log("Error Sending message!!! : ", err);
//                 });
//               }
//               else{
//                 let message = {
//                   notification: {
//                     title: "전적 및 승급 알림",
//                     body: name + "님이 최근 게임에서 승리했습니다."
//                   },
//                 };
//                 admin
//                 .messaging()
//                 .sendToDevice(result, message)
//                 .then(function (response) {
//                   console.log("Successfully sent message: : ", response);
//                 })
//                 .catch(function (err) {
//                   console.log("Error Sending message!!! : ", err);
//                 });
//               }
//             }
//             else if((info_json[1].wins - Number(win)) ==0)
//             {
//               console.log("최근 경기가 없었습니다.")
//             }
//             await Friend.update({
//               name : name
//             },
//             {
//               $set: {
//                 lose : info_json[1].losses,
//                 win : info_json[1].wins,
//                 tier : info_json[1].tier,
//                 rank : info_json[1].rank,
//                 leaguePoint : info_json[1].leaguePoints,
//               }
//             })
//           }
//         });         
//       }
//     }catch (err) {
//       console.log(err);
//     }
//   });



// // Connect Database
// connectDB();

// app.use(express.json());

// // Define Routes
// app.use("/users", require("./api/users"));
// app.use("/friends", require("./api/friend"));


// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "production" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

// app // [5]
//   .listen(5000, () => {
//     console.log(`
//     ################################################
//     🛡️  Server listening on port: 5000 🛡️
//     ################################################
//   `);
//   })
//   .on("error", (err) => {
//     console.error(err);
//     process.exit(1);
//   });
