import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { Operator, OperatorDocument } from '../operator/schemas/operator.schema'; // Adjust the import path as needed
import { logger } from 'src/lib/helpers/utility.logger';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AdminOnly implements NestMiddleware {
  constructor(
    @InjectModel(Operator.name) private operatorModel: Model<OperatorDocument>,
  ) { }

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
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "Secret@123");

      const user = await this.operatorModel.findById(decoded.userId).lean();

      if (!user) {
        return res.status(415).json({ message: 'user not found' });
      }

      req['user'] = { ...decoded, ...user };

      next();
    } catch (error) {
      logger.error(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
