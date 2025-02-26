import {
  Injectable,
  Module,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Operator,
  OperatorDocument,
  OperatorSchema,
} from '../operator/schemas/operator.schema'; // Adjust the import based on your actual User schema path
import {
  PARTICIPANT,
  PROVIDER,
  OPERATOR,
  INACTIVE,
  SUPER_ADMIN,
  ADMIN,
  AWAY,
  EDITOR,
  COMPANY,
} from '../lib/constants/app.constants';
import { OperatorModule } from 'src/operator/operator.module';
import {
  Session,
  SessionDocument,
  SessionSchema,
} from 'src/socket/schemas/session.schema';
import * as dotenv from 'dotenv';
import { User, UserDocument, UserSchema } from 'src/user/schema/user.schema';
dotenv.config();
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Operator.name, schema: OperatorSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    OperatorModule,
  ],
})
@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Operator.name) private operatorModel: Model<OperatorDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const collections = {
      [PROVIDER]: this.userModel,
      [COMPANY]: this.userModel,
      [PARTICIPANT]: this.userModel,
      [OPERATOR]: this.operatorModel,
      [SUPER_ADMIN]: this.operatorModel,
      [ADMIN]: this.operatorModel,
      [EDITOR]: this.operatorModel,
    };

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

      const user = await collections[decoded.role]
        .findById(decoded.userId)
        .lean();

      if (!user) {
        return res.status(444).json({ message: 'user not found' });
      }
      if (user.status === INACTIVE) {
        return res.status(444).json({ message: 'User account is inactive' });
      }
      if (user.status === AWAY) {
        return res.status(444).json({ message: 'User account is inactive' });
      }

      const session = await this.sessionModel.findOne({ token: token });

      if (!session || !session.status) {
        return res
          .status(440)
          .json({ success: false, message: 'session expired' });
      }

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (session && session.expiry && session.expiry < currentTimestamp) {
        await this.sessionModel.findOneAndUpdate(
          { token: token },
          { status: false },
        );
        return res
          .status(440)
          .json({ success: false, message: 'session expired' });
      }

      req['user'] = { ...decoded, ...user };
      next();
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
