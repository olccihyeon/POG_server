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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const Users_1 = __importDefault(require("../models/Users"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
/**
 *  @route POST api/users
 *  @desc Create a user
 *  @access Public
 */
router.post("/", [(0, express_validator_1.check)("device_id", "id is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const device_id = req.body.device_id;
    try {
        let user = yield Users_1.default.findOne({ device_id });
        if (user) {
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: 360000 }, (err, token) => {
                if (err)
                    throw err;
                res.status(200).json({ success: true, data: { token } });
            });
        }
        else {
            let ispush = true;
            user = new Users_1.default({
                device_id,
                ispush,
            });
            yield user.save();
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: 360000 }, (err, token) => {
                if (err)
                    throw err;
                res.status(201).json({ success: true, data: { token } });
            });
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
/**
 *  @route GET api/users
 *  @desc Get user by ID
 *  @access Public
 */
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Users_1.default.findById(req.body.user.id).select("-device_id -_id -__v");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "사용자 조회 실패" });
        }
        res.status(200).json({ success: true, data: { user } });
    }
    catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res
                .status(404)
                .json({ success: false, message: "사용자 조회 실패" });
        }
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
/**
 *  @route PATCH api/users
 *  @desc PATCH user by ID
 *  @access Public
 */
router.patch("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const delperiod = req.body.delperiod;
    if (delperiod >= 8) {
        res.status(400).json({ success: false, message: "조건에 맞지 않는 요청" });
    }
    try {
        if (req.body.ispush != null && typeof req.body.ispush == "boolean") {
            yield Users_1.default.findByIdAndUpdate(req.body.user.id, {
                ispush: req.body.ispush,
            });
        }
        const user = yield Users_1.default.findById(req.body.user.id).select("-device_id -_id -__v");
        res.status(200).json({ success: true, data: { user } });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=users.js.map