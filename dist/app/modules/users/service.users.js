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
exports.userService = void 0;
const model_users_1 = require("./model.users");
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_users_1.User.create(payload);
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_users_1.User.find();
    return result;
});
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_users_1.User.findOne({ email });
});
exports.userService = {
    createUserIntoDB,
    getAllUsers,
    findByEmail
};
