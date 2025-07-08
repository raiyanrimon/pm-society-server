import Iuser from "./interface.users";
import { User } from "./model.users";

const createUserIntoDB = async (payload: Iuser) => {
    const result = await User.create(payload);
    return result;

}

const getAllUsers = async () => {
    const users = await User.find();
    return users;
}

export const userService = {
    createUserIntoDB,
getAllUsers}