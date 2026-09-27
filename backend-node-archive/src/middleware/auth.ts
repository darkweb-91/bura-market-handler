import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user as any;
    next();
  });
};

export const requireSuperadmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'SUPERADMIN') {
    return res.status(403).json({ error: 'Superadmin access required' });
  }
  next();
};
