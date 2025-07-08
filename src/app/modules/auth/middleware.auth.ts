import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from "../../config";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid' });
  }
};
