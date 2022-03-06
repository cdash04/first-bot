import { Request, Response, NextFunction } from 'lambda-api';

export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.cors({});
  next();
};
