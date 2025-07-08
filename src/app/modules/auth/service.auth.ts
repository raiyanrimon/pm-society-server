

import config from "../../config";
import { User } from "../users/model.users";
import { IAuth } from "./interface.auth";
import { createToken,  } from "./utils.auth";

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

    // generate JWT token
    const jwtPayload = {
        email: user.email,
        name: user.name,
        course: user.course,
        role: user.role as string,
        createAt: user.createdAt,
     
        
    }
    const accessToken = createToken(
        jwtPayload,
        config.JWT_SECRET as string,
        config.JWT_EXPIRES_IN as string,
    )

    // const refreshToken = createToken(
    //     jwtPayload,
    //     config.JWT_REFRESH_SECRET as string,
    //     config.JWT_REFRESH_EXPIRES_IN as string,)


return {
        accessToken,
        // refreshToken
        is_auth: true,
        userRole: user.role,
    }
}



export const authService = {
    loginUser,  }