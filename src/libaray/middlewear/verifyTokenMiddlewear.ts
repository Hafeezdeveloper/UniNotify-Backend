import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    //   const user = await this.operatorModel.findById(decoded.userId).lean();

    //   if (!user) {
    //     return res.status(415).json({message: 'user not found'});
    //   }

      // Attach the user information to the request object for further use
      // req['user'] = decoded;

      next(); // Allow the request to proceed
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
