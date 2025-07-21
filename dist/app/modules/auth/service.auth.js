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
exports.authService = void 0;
const config_1 = __importDefault(require("../../config"));
const model_users_1 = require("../users/model.users");
const utils_auth_1 = require("./utils.auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists in the database
    const user = yield model_users_1.User.isUserExistsByEmail(payload.email);
    if (!user) {
        throw new Error("User not found");
    }
    // compare password
    const isPasswordValid = yield model_users_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const userRole = user.role;
    // generate JWT token
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.JWT_SECRET, config_1.default.JWT_EXPIRES_IN);
    return {
        accessToken,
        userRole
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_users_1.User.isUserExistsByEmail(userData.email);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.password && !(yield model_users_1.User.isPasswordMatched(payload.oldPassword, user.password))) {
        throw new Error("Invalid old password");
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.BCRYPT_SALT_ROUNDS));
    yield model_users_1.User.findOneAndUpdate({ email: userData.email, role: userData.role }, { password: newHashedPassword, passwordChangedAt: new Date() });
    return null;
});
exports.authService = {
    loginUser, changePassword
};
