import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Operator, OperatorSchema} from './schemas/operator.schema';
import {OperatorService} from './operator.service';
import {OperatorController} from './operator.controller';
import {JwtModule} from '@nestjs/jwt';
import {AuthModule} from '../auth/auth.module';
import {OtpModule} from '../otp/otp.module';
import {MailModule} from '../mail/mail.module';
import {UserModule} from '../user/user.module';
import {EmailRecords, EmailRecordsSchema} from './schemas/emailOperator.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { AdminOnly } from 'src/middleware/adminTokenMiddleware';
// import { AuthGuard } from 'src/auth/auth.guard';
// import { VerifyTokenMiddleware } from '../middleware/verifyToken.middleware';
// import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Operator.name, schema: OperatorSchema},
      {name: User.name, schema: UserSchema},
      {name: EmailRecords.name, schema: EmailRecordsSchema},
    ]),
    forwardRef(() => UserModule),
    JwtModule,
    OtpModule,
    AuthModule,
    MailModule,
  ],
  controllers: [OperatorController],
  providers: [OperatorService],
  exports: [OperatorService, MongooseModule],
})
export class OperatorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminOnly)
      .forRoutes(
        {path: 'operator/create', method: RequestMethod.POST},
        {path: 'operator/update/:id', method: RequestMethod.PUT},
        {path: 'operator/deactivate/:id', method: RequestMethod.PUT},
        {path: 'operator/all', method: RequestMethod.GET},
        {path: 'operator/send-mail', method: RequestMethod.POST},
        {path: 'operator/send-mail/all/user', method: RequestMethod.POST},
        {path: 'operator/all-mail', method: RequestMethod.GET},
      );
  }
}
