

import config from "../../config";
import { User } from "../users/model.users";
import { IAuth } from "./interface.auth";
import { createToken,  } from "./utils.auth";
import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";


const loginUser = async(payload: IAuth) => {
    // check if user exists in the database
    const user = await User.isUserExistsByEmail(payload.email);
    if (!user) {
        throw new Error("User not found");
    }
    // compare password
    const isPasswordValid = await User.isPasswordMatched(payload?.password, user?.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const userRole = user.role;

    // generate JWT token
    const jwtPayload = {
        email: user.email,
        role: user.role as string, 
    }
    const accessToken = createToken(
        jwtPayload,
        config.JWT_SECRET as string,
        config.JWT_EXPIRES_IN as string,
    )




return {
        accessToken,
        userRole
       
    }
}
const changePassword = async (userData: JwtPayload, payload: {oldPassword: string, newPassword: string}) => {

    const user = await User.isUserExistsByEmail(userData.email);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.password && !(await User.isPasswordMatched(payload.oldPassword, user.password))) {
        throw new Error("Invalid old password");
    }

      const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALT_ROUNDS),
  );

  await User.findOneAndUpdate({ email: userData.email, role: userData.role }, { password: newHashedPassword,passwordChangedAt: new Date() });

return null

}


export const authService = {
    loginUser, changePassword}