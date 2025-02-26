//src/socket/socket/socket.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { Session, SessionSchema } from './schemas/session.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketGateway } from './socket.gateway';
import { UserModule } from 'src/user/user.module';
import { SessionService } from './session.service';
// import {ChatService} from 'src/chat/chat.service';
// import {Message, MessageSchema} from 'src/chat/schemas/message.schema';
// import {
//   Conversation,
//   ConversationSchema,
// } from 'src/chat/schemas/conversation.schema';
// import {
//   LastMessage,
//   LastMessageSchema,
// } from 'src/chat/schemas/last-message.schema';

// import {Block, BlockSchema} from 'src/block/schemas/block.schema';
// import {NotificationsService} from 'src/notifications/notifications.service';
// import {ActivityLogService} from 'src/activity-log/activity-log.service';
// import {
//   Notification,
//   NotificationSchema,
// } from 'src/notifications/schemas/notification.schema';
// import {
//   NotificationSetting,
//   NotificationSettingSchema,
// } from 'src/notification-setting/schemas/notification-setting.schema';
// import {
//   ActivityLog,
//   ActivityLogSchema,
// } from 'src/activity-log/schemas/activity-log.schemas';
// import {FirebaseService} from 'src/notifications/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      // {name: Message.name, schema: MessageSchema},
      // {name: Conversation.name, schema: ConversationSchema},
      // {name: LastMessage.name, schema: LastMessageSchema},
      // {name: Block.name, schema: BlockSchema},
      // {name: Notification.name, schema: NotificationSchema},
      // {name: NotificationSetting.name, schema: NotificationSettingSchema},
      // {name: ActivityLog.name, schema: ActivityLogSchema},
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [
    SocketGateway,
    SocketService,
    SessionService,
    // ChatService,
    // NotificationsService,
    // ActivityLogService,
    // FirebaseService,
  ],
  exports: [SocketGateway, SocketService],
})
export class SocketModule { }
