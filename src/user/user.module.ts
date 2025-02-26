import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyTokenMiddleware } from 'src/libaray/middlewear/verifyTokenMiddlewear';
import { OtpModule } from 'src/otp/otp.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Session, SessionSchema } from 'src/socket/schemas/session.schema';
import { MailService } from 'src/mail/mail.service';
import { OtpService } from 'src/otp/otp.service';
import { Otp, OtpSchema } from 'src/otp/schemas/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    OtpModule,
    MailModule,

  ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService, MailService,OtpService],
  exports: [UserService]

})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(
      // {path: 'user/chat-profile/:userId', method: RequestMethod.GET},
    );
  }
}
