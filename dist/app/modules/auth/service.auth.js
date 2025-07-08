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
    // generate JWT token
    const jwtPayload = {
        email: user.email,
        name: user.name,
        course: user.course,
        role: user.role,
        createAt: user.createdAt,
    };
    const accessToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.JWT_SECRET, config_1.default.JWT_EXPIRES_IN);
    // const refreshToken = createToken(
    //     jwtPayload,
    //     config.JWT_REFRESH_SECRET as string,
    //     config.JWT_REFRESH_EXPIRES_IN as string,)
    return {
        accessToken,
        // refreshToken
        is_auth: true,
        userRole: user.role,
    };
});
exports.authService = {
    loginUser,
};
