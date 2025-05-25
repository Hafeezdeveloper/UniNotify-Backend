import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { AcademicService } from './academic.service';
import { Batch, BatchSchema } from './schema/batch.schema';
import { Department, DepartmentSchema } from './schema/department.schema';
import { Section, SectionSchema } from './schema/section.schema';
import { Semester, SemesterSchema } from './schema/semester.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Batch.name, schema: BatchSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Section.name, schema: SectionSchema },
      { name: Semester.name, schema: SemesterSchema },
    ]),
    OtpModule,
    MailModule,

  ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService, MailService, OtpService, AcademicService],
  exports: [UserService]

})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(
        { path: 'user/all', method: RequestMethod.GET },
      );
  }
}
