"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FriendsSchema = new mongoose_1.default.Schema({
    user_id: [{
            type: mongoose_1.default.SchemaTypes.ObjectId,
            ref: "Users",
            required: true
        }],
    name: {
        type: String,
        required: true
    },
    tier: {
        type: String,
        default: "tier"
    },
    rank: {
        type: String,
    },
    win: {
        type: Number,
        default: 0
    },
    lose: {
        type: Number,
        default: 0
    },
    profileIconId: {
        type: Number,
    },
    puuid: {
        type: String,
    },
    lol_id: {
        type: String,
    }
});
exports.default = mongoose_1.default.model("Friends", FriendsSchema);
//# sourceMappingURL=Friends.js.map