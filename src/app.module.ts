import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OperatorModule } from './operator/operator.module';
import { OtpService } from './otp/otp.service';
import { Otp, OtpSchema } from './otp/schemas/otp.schema';
import { NotificationSettingModule } from './notification-setting/notification-setting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    UserModule,
    OperatorModule,
    NotificationSettingModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService, OtpService],
})
export class AppModule { }
