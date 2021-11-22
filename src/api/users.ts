import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/Users";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Friend from "../models/Friends";

const router = Router();

/**
 *  @route POST api/users
 *  @desc Create a user
 *  @access Public
 */

router.post(
  "/",
  [
    check("device_id", "id is required").not().isEmpty(),
    check("firebaseToken", "fcmtoken is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    console.log(req.body);
    const device_id = req.body.device_id;
    const firebaseToken = req.body.firebaseToken;
    console.log(req.body);
    try {
      let user = await User.findOne({ device_id });
      if (user) {
        const payload = {
          user: {
            id: user.id,
          },
        };
        jwt.sign(
          payload,
          config.jwtSecret,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({ success: true, data: { token } });
          }
        );
      } else {
        let ispush = true;




        user = new User({
          device_id,
          ispush,
          firebaseToken,
        });

        await user.save();


      
        const payload = {
          user: {
            id: user.id,
          },
        };
        const appendid = await Friend.find({ name : "괴물쥐"});
        await Friend.update({ name : "괴물쥐"},
        { $push : { user_id : user.id}});

        jwt.sign(
          payload,
          config.jwtSecret,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.status(201).json({ success: true, data: { token } });
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "서버 오류" });
    }
  }
);

/**
 *  @route GET api/users
 *  @desc Get user by ID
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id).select(
      "-device_id -_id -__v"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "사용자 조회 실패" });
    }
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ success: false, message: "사용자 조회 실패" });
    }
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

/**
 *  @route PATCH api/users
 *  @desc PATCH user by ID
 *  @access Public
 */
router.patch("/", auth, async (req: Request, res: Response) => {
  const delperiod = req.body.delperiod;
  if (delperiod >= 8) {
    res.status(400).json({ success: false, message: "조건에 맞지 않는 요청" });
  }
  try {
    if (req.body.ispush != null && typeof req.body.ispush == "boolean") {
      await User.findByIdAndUpdate(req.body.user.id, {
        ispush: req.body.ispush,
      });
    }

    const user = await User.findById(req.body.user.id).select(
      "-device_id -_id -__v"
    );
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

module.exports = router;
