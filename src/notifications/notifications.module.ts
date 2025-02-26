import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import {NotificationsService} from './notifications.service';
import {NotificationsController} from './notifications.controller';
import {NotificationSettingModule} from 'src/notification-setting/notification-setting.module';
import {Notification, NotificationSchema} from './schemas/notification.schema';
import {MongooseModule} from '@nestjs/mongoose';
import {Session, SessionSchema} from 'src/socket/schemas/session.schema';
import {UserModule} from 'src/user/user.module';
import {OperatorModule} from 'src/operator/operator.module';
import {SocketModule} from 'src/socket/socket.module';
import {FirebaseService} from './firebase.service';
import { VerifyTokenMiddleware } from 'src/libaray/middlewear/verifyTokenMiddlewear';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Notification.name, schema: NotificationSchema},
      {name: Session.name, schema: SessionSchema},
    ]),
    forwardRef(() => NotificationSettingModule),
    UserModule,
    OperatorModule,
    SocketModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, FirebaseService],
})
export class NotificationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes({path: 'notifications/*', method: RequestMethod.ALL});
  }
}
