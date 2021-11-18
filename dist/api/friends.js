"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Friends_1 = __importDefault(require("../models/Friends"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
var request = require("request");
const key = "RGAPI-1402667a-c381-48e2-81b1-f47c84d54f84";
/**
 *  @route POST api/categories
 *  @desc Create a category
 *  @access Private
 */
router.post("/", auth_1.default, [(0, express_validator_1.check)("name", "name is required").not().isEmpty()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const name = req.body.name;
    const num = yield Friends_1.default.find({
        user_id: req.body.user.id,
    }).count();
    const checkname = yield Friends_1.default.find({
        user_id: req.body.user.id,
        name: req.body.name
    }).count();
    if (num > 5) {
        res.status(409).json({ success: false, message: "즐겨찾기 5명 초과" });
    }
    else {
        if (checkname[0]) {
            res.status(409).json({ success: false, message: "중복된 이름 존재" });
        }
        else {
            try {
                const appendid = yield Friends_1.default.find({ name: req.body.name });
                if (appendid[0]) {
                    yield Friends_1.default.update({ name: req.body.name }, { $push: { user_id: req.body.user.id } });
                }
                else {
                    var url = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + encodeURI(req.body.name) + "?api_key=" + key;
                    yield request(url, function (err, res, body) {
                        return __awaiter(this, void 0, void 0, function* () {
                            var info_json = JSON.parse(body);
                            const newFriend = yield new Friends_1.default({
                                user_id: req.body.user.id,
                                name: req.body.name,
                                profileIconId: info_json.profileIconId,
                                puuid: info_json.puuid,
                                lol_id: info_json.id
                            });
                            yield newFriend.save();
                        });
                    });
                }
                const friends = yield Friends_1.default.find({
                    user_id: req.body.user.id,
                }).select("-__v ");
                res.status(201).json({ success: true, data: { friends } });
            }
            catch (err) {
                console.error(err.message);
                res.status(500).json({ success: false, message: "서버 오류" });
            }
        }
    }
}));
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const friends = yield Friends_1.default.find({
            user_id: req.body.user.id,
        }).select("-__v ");
        res.status(200).json({ success: true, data: { friends } });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
router.delete("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const f = yield Friends_1.default.findOne({ _id: req.query._id });
        if (f.user_id.length == 1) {
            yield Friends_1.default.deleteOne({ _id: req.query._id });
        }
        yield Friends_1.default.update({ _id: req.query._id }, { $pull: { user_id: req.body.user.id } });
        const friends = yield Friends_1.default.find({
            user_id: req.body.user.id,
        });
        res.status(200).json({ success: true, data: { friends } });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=friends.js.map