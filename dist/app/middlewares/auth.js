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
exports.USER_ROLE = void 0;
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_users_1 = require("../modules/users/model.users");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.USER_ROLE = {
    admin: "admin",
    member: "member",
};
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.cookies.accessToken;
        console.log(token);
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        console.log(decoded);
        const { role, email, iat } = decoded;
        const user = yield model_users_1.User.isUserExistsByEmail(email);
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (user.passwordChangedAt &&
            model_users_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        if (!requiredRoles.includes(role)) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
