import { Request, Response } from "express";
import { authService } from "./service.auth";
import catchAsync from "../../utils/catchAsync";
import { User } from "../users/model.users";

interface AuthRequest extends Request {
  user?: { email: string; role: string };
}

const loginUser = async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  const { accessToken, userRole } = result;

  if (result !== undefined && result !== null) {
    res.status(200).json({
      message: "Login successful",
      data: accessToken,
      userRole
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
     return
  }

  const user = await User.findOne({ email: req.user.email }).lean();
  if (!user) {
     res.status(404).json({ message: "User not found" });
     return
  }

  delete (user as any).password;

  res.status(200).json({ message: "User profile fetched", data: user });
});

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

const changePassword = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
     res.status(401).json({ message: "Not authenticated" });
     return
  }

  const passwordData = req.body;
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
