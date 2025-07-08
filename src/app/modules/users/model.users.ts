import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import Iuser, { UserModel } from "./interface.users";

const userSchema = new Schema<Iuser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    course: { type: String },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// hash the password before saving
// This middleware will run before saving a user document
userSchema.pre("save", async function (next) {
  const user = this as Iuser;
  // Hash the password before saving
  user.password = await bcrypt.hash(
    user.password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );
  next();
});

// set '' after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// find user by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return User.findOne({ email }).select("+password");
};

// compare password
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = mongoose.model<Iuser, UserModel>("User", userSchema);
