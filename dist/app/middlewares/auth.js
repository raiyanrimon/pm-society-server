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
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_users_1 = require("../modules/users/model.users");
const USER_ROLE = {
    admin: 'admin',
    member: 'member',
};
const authMiddleware = (role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        //  Check if token is provided
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        //    Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        const { role, email } = decoded;
        // Check if the user exists
        const user = yield model_users_1.User.isUserExistsByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Check if the user has the required role
        if (!role.includes(role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = decoded;
        next();
    });
};
exports.default = authMiddleware;
