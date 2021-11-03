import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/Users";
import Friend from "../models/Friends";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";


const router = Router();



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
        if(num >5){
            res.status(409).json({ success: false, message: "즐겨찾기 5명 초과" });
        }
        else
        {
            if (checkname) {
            res.status(409).json({ success: false, message: "중복된 이름 존재" });
            } else 
            {
                try {
                    const newFriend = new Friend({
                        user_id : req.body.user.id,
                        name : req.body.name
                    });
                    await newFriend.save();
                    const friend = await Friend.find({
                        user_id: req.body.user.id,
                    }).select("-__v -user_id ");

                    res.status(201).json({ success: true, data: { friend } });
                    }
                catch (err) {
                console.error(err.message);
                res.status(500).json({ success: false, message: "서버 오류" });
                }
            }

        }   
    }
);