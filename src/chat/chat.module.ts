import { AdminOnly } from 'src/middleware/adminTokenMiddleware';
import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {ChatService} from './chat.service';
import {ChatController} from './chat.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {Message, MessageSchema} from './schemas/message.schema';

import {Conversation, ConversationSchema} from './schemas/conversation.schema';
import {LastMessage, LastMessageSchema} from './schemas/last-message.schema';

import {UserModule} from 'src/user/user.module';
import {OperatorModule} from 'src/operator/operator.module';
import {SocketModule} from 'src/socket/socket.module';
import {NotificationsService} from 'src/notifications/notifications.service';
import {
  Notification,
  NotificationSchema,
} from 'src/notifications/schemas/notification.schema';
import {
  NotificationSetting,
  NotificationSettingSchema,
} from 'src/notification-setting/schemas/notification-setting.schema';
import {FirebaseService} from 'src/notifications/firebase.service';
import {SessionService} from 'src/socket/session.service';
import { VerifyTokenMiddleware } from 'src/libaray/middlewear/verifyTokenMiddlewear';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Message.name, schema: MessageSchema},
      {name: Conversation.name, schema: ConversationSchema},
      {name: LastMessage.name, schema: LastMessageSchema},
      {name: Notification.name, schema: NotificationSchema},
      {name: NotificationSetting.name, schema: NotificationSettingSchema},
    ]),
    UserModule,
    OperatorModule,
    SocketModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    NotificationsService,
    FirebaseService,
    SessionService,
  ],
})
export class ChatModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes({path: 'chat/*', method: RequestMethod.ALL});
    consumer
      .apply(AdminOnly)
      .forRoutes({path: 'admin/*', method: RequestMethod.ALL});
  }
}
