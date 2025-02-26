import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtModule} from '@nestjs/jwt';
import {AuthController} from './auth.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {Session, SessionSchema} from '../socket/schemas/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Session.name, schema: SessionSchema}]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
