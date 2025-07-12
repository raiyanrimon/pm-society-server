import { Request, Response } from "express";
import { authService } from "./service.auth";
import catchAsync from "../../utils/catchAsync";
import { User } from "../users/model.users";

const loginUser = async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  const { accessToken } = result;
  console.log(accessToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("is_auth", true, {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 1000 * 60 * 60,
  });

  if (result !== undefined && result !== null) {
    res
      .status(200)
      .json({
        message: "Login successful",
        data: accessToken,
        userRole: result.userRole,
      });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const { email } = req.user;

    // Find the full user document
    const user = await User.findOne({ email }).lean();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Don't include password hash
    delete (user as any).password;

    res.status(200).json({
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.clearCookie("is_auth", {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong during logout",
    });
  }
};

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const result = await authService.changePassword(req.user, passwordData);
  res.status(200).json({
    message: "Password changed successfully",
    data: result,
  });
});

export const authController = {
  loginUser,
  getMe,
  logoutUser,
  changePassword,
};
