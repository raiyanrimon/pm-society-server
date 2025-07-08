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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const service_auth_1 = require("./service.auth");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_auth_1.authService.loginUser(req.body);
    const { accessToken, userRole } = result;
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    // res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "none",
    // });
    res.cookie("is_auth", true, {
        httpOnly: false,
        secure: false, // don't use true for localhost
        sameSite: "lax", // "lax" is safest and works
    });
    res.cookie("userRole", userRole, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
    });
    if (result !== undefined && result !== null) {
        res.status(200).json({ message: "Login successful", data: accessToken, });
    }
    else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});
const getMe = (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    res.json({ user: req.user });
};
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        });
        // res.clearCookie("refreshToken", {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "production",
        //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        //   path: "/",
        // });
        res.clearCookie("is_auth", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
        });
        res.clearCookie("userRole", {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
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
exports.authController = {
    loginUser, getMe, logoutUser
};
