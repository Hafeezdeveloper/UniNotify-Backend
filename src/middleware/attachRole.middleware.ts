import {Request, Response, NextFunction} from 'express';

export function attachRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as any).role = role;
    next();
  };
}
