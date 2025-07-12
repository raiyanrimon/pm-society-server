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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const service_auth_1 = require("./service.auth");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const model_users_1 = require("../users/model.users");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_auth_1.authService.loginUser(req.body);
    const { accessToken } = result;
    console.log(accessToken);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 1000 * 60 * 60,
    });
    res.cookie("is_auth", true, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 1000 * 60 * 60,
    });
    if (result !== undefined && result !== null) {
        res
            .status(200)
            .json({
            message: "Login successful",
            data: accessToken,
            userRole: result.userRole,
        });
    }
    else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const { email } = req.user;
        // Find the full user document
        const user = yield model_users_1.User.findOne({ email }).lean();
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Don't include password hash
        delete user.password;
        res.status(200).json({
            message: "User profile fetched successfully",
            data: user,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        res.clearCookie("is_auth", {
            httpOnly: false,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        return res.status(200).json({
            message: "Logged out successfully",
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Something went wrong during logout",
        });
    }
});
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordData = __rest(req.body, []);
    const result = yield service_auth_1.authService.changePassword(req.user, passwordData);
    res.status(200).json({
        message: "Password changed successfully",
        data: result,
    });
}));
exports.authController = {
    loginUser,
    getMe,
    logoutUser,
    changePassword,
};
