import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import config from '../config';

interface AuthRequest extends Request {
  user?: jwt.JwtPayload;
}

export const authenticateJWT = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  const decoded = jwt.verify(token, config.JWT_SECRET as string) as jwt.JwtPayload;
  req.user = decoded; // attach user info to request
  next();
});
