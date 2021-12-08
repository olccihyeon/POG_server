import Friend from "../models/Friends";
import User from "../models/Users";


export function sendmessage(admin, result, name, mes){ 
   
    let message = {
        notification: {
          title: "솔로랭크 전적 및 승급 알림",
          body: name + mes
        },
      };
      admin
      .messaging()
      .sendToDevice(result, message)
      .then(function (response) {
        console.log("Successfully sent message: : ", response);
      })
      .catch(function (err) {
        console.log("Error Sending message!!! : ", err);
      });
}


