import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Session, SessionDocument} from 'src/socket/schemas/session.schema';
import {GenerateTokenOptions} from './dto/auth.dto';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async generateToken(options: GenerateTokenOptions) {
    const {
      userId,
      userEmail,
      role,
      // isMember,
      expiresIn = 24 * 60 * 60,
      mobileSession,
    } = options;

    const payload = {email: userEmail, role, userId,};

    const now = moment().unix();
    const expiryDateTime = now + expiresIn;
    const newSession = new this.sessionModel({
      userId,
      expiry: expiryDateTime,
      mobileSession,
    });

    const savedSession = await newSession.save();

    payload['sessionId'] = savedSession._id;

    const currentToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    newSession.token = currentToken;

    await newSession.save();
    return currentToken;
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {secret: process.env.JWT_SECRET});
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
