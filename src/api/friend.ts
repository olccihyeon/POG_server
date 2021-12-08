import express, { Router, Request, Response } from "express";
import Friend from "../models/Friends";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Friends from "../models/Friends";


const router = Router();


var request = require("request-promise-native");

const key = "RGAPI-1402667a-c381-48e2-81b1-f47c84d54f84"
/**
 *  @route POST api/categories
 *  @desc Create a category
 *  @access Private
 */

router.post(
    "/",
    auth,
    [check("name", "name is required").not().isEmpty()],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
        }
        const name = req.body.name;
        const num = await Friend.find({
        user_id: req.body.user.id,
        
        }).count();
        const checkname = await Friend.find({
            user_id: req.body.user.id,
            name : req.body.name
        }).count();
        if(num >=5){
            res.status(409).json({ success: false, message: "즐겨찾기 5명 초과" });
        }
        else
        {   
     
            if (checkname) {
            res.status(409).json({ success: false, message: "중복된 이름 존재" });
            } else 
            {
                try {
                    const appendid = await Friend.find({ name : req.body.name});
                    
                    if(appendid[0])
                    {
                      await Friend.update({ name : req.body.name},
                      { $push : { user_id : req.body.user.id}});

                      const friends = await Friend.find({
                        user_id: req.body.user.id,
                      }).select("-__v ");
                  
                      res.status(201).json({ success: true, data: { friends } });
                    }
                    else{
                
                        var url = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+encodeURI(req.body.name)+"?api_key="+key
                  
                      const response1 = await request(url, async function(err, res, body){});
                      var info_json = JSON.parse(response1)
                      const newFriend = await new Friend({
                            user_id : req.body.user.id,
                            name : req.body.name,
                            profileIconId : info_json.profileIconId,
                            puuid : info_json.puuid,
                            lol_id : info_json.id
                          });
                      await newFriend.save();
                  
                      const friend1s = await Friend.find({
                      user_id: req.body.user.id,
                      }).select("-__v ");
                
                      await res.status(201).json({ success: true, data: { friend1s } });
                             
                       
                      
                      }
                  }
                
                catch (err) {
                console.error(err.message);
                res.status(500).json({ success: false, message: "서버 오류" });
                }
            }

        }   
    }
);

router.get("/", auth, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const friends = await Friend.find({
            user_id: req.body.user.id,
        }).select("-__v ");

      res.status(200).json({ success: true, data: { friends } });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "서버 오류" });
    }
  });
  

router.delete("/", auth, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const f = await Friend.findOne({ _id : req.query._id})
        if(f.user_id.length == 1)
        {
           await Friend.deleteOne({_id : req.query._id})
        }
        await Friend.update({ _id : req.query._id},
          {$pull : { user_id : req.body.user.id}});
        const friends = await Friend.find({
          user_id: req.body.user.id,
        })
        res.status(200).json({ success: true, data: { friends } });
      }   
    catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "서버 오류" });
    }
  });
module.exports = router;