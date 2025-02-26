import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import {
  NotificationSetting,
  NotificationSettingSchema,
} from './schemas/notification-setting.schema';
import {UserModule} from '../user/user.module';
import {MongooseModule} from '@nestjs/mongoose';
import {NotificationSettingController} from './notification-setting.controller';
import {NotificationSettingService} from './notification-setting.service';
import {OperatorModule} from 'src/operator/operator.module';
import { VerifyTokenMiddleware } from 'src/libaray/middlewear/verifyTokenMiddlewear';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: NotificationSetting.name, schema: NotificationSettingSchema},
    ]),
    forwardRef(() => UserModule),
    OperatorModule,
  ],
  controllers: [NotificationSettingController],
  providers: [NotificationSettingService],
  exports: [NotificationSettingService, MongooseModule],
})
export class NotificationSettingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(
        {path: 'notification-settings', method: RequestMethod.GET},
        {path: 'notification-settings/update', method: RequestMethod.PUT},
      );
  }
}
