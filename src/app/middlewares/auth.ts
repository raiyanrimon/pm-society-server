import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/users/model.users";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request { user: JwtPayload; }
  }
}

export const USER_ROLE = {
  admin: "admin",
  member: "member",
} as const

type UserRole = keyof typeof USER_ROLE;

const auth = (...requiredRoles: UserRole[]) => { 
  return catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.accessToken;  

    console.log(token);


    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(
      token,
      config.JWT_SECRET as string
    ) as JwtPayload;

    console.log(decoded);

    const { role, email, iat } = decoded;

    const user = await User.isUserExistsByEmail(email);

    if(!user){
      res.status(401).json({ message: "Unauthorized" });
      return   
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    if (!requiredRoles.includes(role as UserRole)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    req.user = decoded;

    next();
  });
};




export default auth
