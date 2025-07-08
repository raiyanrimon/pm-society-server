import { Request, Response } from "express";
import { authService } from "./service.auth";


// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const loginUser = async (req: Request, res: Response) => {
    const result = await authService.loginUser(req.body);

    const { accessToken, userRole } = result
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    // res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "none",
    // });
res.cookie("is_auth", true, {
  httpOnly: false,
  secure: false,    // don't use true for localhost
  sameSite: "lax",  // "lax" is safest and works
});

res.cookie("userRole", userRole, {
  httpOnly: false,
  secure: false,
sameSite: "lax",
})

    if (result !== undefined && result !== null) {
        res.status(200).json({ message: "Login successful", data: accessToken, });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
}

const getMe = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  res.json({ user: req.user });
};
const logoutUser = async (req: Request, res: Response) => {
  try {
    
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    // res.clearCookie("refreshToken", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   path: "/",
    // });

    res.clearCookie("is_auth", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    })

    res.clearCookie("userRole", {
httpOnly: false,
  secure: false,
sameSite: "lax",
    })


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


export const authController = {
    loginUser, getMe, logoutUser}