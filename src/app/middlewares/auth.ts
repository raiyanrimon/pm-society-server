import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/users/model.users";

const USER_ROLE = {
    admin: 'admin',
    member: 'member',
}

type UserRole = keyof typeof USER_ROLE;


const authMiddleware = (role: UserRole[]) => {
    return async (req: any, res: any, next: any) => {
 const token =req.header("Authorization")?.replace("Bearer ", "");

//  Check if token is provided
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

    //    Verify the token
            const decoded =jwt.verify(token, config.JWT_SECRET as string) as JwtPayload

            const {role, email} = decoded;
            // Check if the user exists
            const user = await User.isUserExistsByEmail(email);
            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }


            // Check if the user has the required role
            if (!role.includes(role as UserRole)) {
                return res.status(403).json({ message: "Forbidden" })}

          req.user = decoded as JwtPayload

          next()
    };
}

export default authMiddleware;