import { Model } from "mongoose";

export default interface Iuser{
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    course?: string;
    amount?: number;
    role?: "member" | "admin"
    createdAt?: Date;   
}

export interface UserModel extends Model<Iuser> {
    isUserExistsByEmail(email: string): Promise<Iuser | null>;
      isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}