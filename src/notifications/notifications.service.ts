import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  ADMIN_LOGO,
  DEFAULT_PROFILE_IMAGE_PATH,
  SOCKET_EVENTS,
} from '../lib/constants/app.constants';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import {
  NotificationSetting,
  NotificationSettingDocument,
} from '../notification-setting/schemas/notification-setting.schema';
import { Model, Types } from 'mongoose';
import { logger } from '../lib/helpers/utility.logger';
import { Session, SessionDocument } from '../socket/schemas/session.schema';
import {
  getDocumentTotal,
  Pagination,
  paginationParams,
  successHandler,
} from 'src/lib/helpers/utility.helpers';
import { SocketGateway } from 'src/socket/socket.gateway';
import { FirebaseService } from './firebase.service';
import { User, UserDocument } from 'src/user/schema/user.schema';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationSetting.name)
    private notificationSettingModel: Model<NotificationSettingDocument>,
    @InjectModel(Session.name) private sessionsModel: Model<SessionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => SocketGateway))
    private readonly socketGateway: SocketGateway,
    private readonly firebaseService: FirebaseService, // Inject SocketGateway
  ) { }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const {
      userId,
      title,
      icon,
      message,
      notificationType = null,
      routeId = null,
      routing = null,
      session = null,
    } = createNotificationDto;

    try {
      // if no image is provided for notification user default image
      const finalImageUrl = icon || DEFAULT_PROFILE_IMAGE_PATH;
      //checking types of notifications that user has allowed.
      const notificationAllowed = await this.notificationSettingModel.findOne({
        userId: new Types.ObjectId(userId),
      });

      // if (notificationType && !notificationAllowed[notificationType]) {
      //   return null;
      // }
      if (!notificationAllowed || (notificationType && !notificationAllowed[notificationType])) {
        return null;
      }
      // create notification
      const newNotification = new this.notificationModel({
        userId: new Types.ObjectId(userId),
        title,
        imageUrl: finalImageUrl,
        routeId,
        notificationRoute: routing,
        message,
      });

      await newNotification.save({ session });

      // calling the socket emit function.
      this.socketGateway.customEvents(
        userId,
        SOCKET_EVENTS.NOTIFICATION,
        newNotification,
      );

      // sending mobile push notification
      const route = routeId ? routeId.toString() : null;
      await this.sendPushNotification(
        userId.toString(),
        title,
        message,
        icon,
        routing,
        route,
      );

      return newNotification;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async findAll(id: string) {
    return await this.notificationModel.find({ userId: new Types.ObjectId(id) });
  }

  async getNotifications(userId: string, page?: number, limit?: number) {
    const { currentPage, pageSize, skip } = paginationParams(page, limit);

    const [result] = await this.notificationModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $facet: {
          documents: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: pageSize },
          ],
          totalCount: [{ $count: 'value' }],
          totalUnread: [{ $match: { read: false } }, { $count: 'value' }],
        },
      },
    ]);

    const { documents, totalCount, totalUnread } = result;
    const unreadCount = getDocumentTotal(totalUnread);

    const totalItems = getDocumentTotal(totalCount);
    const paginated = Pagination({
      totalItems,
      page: currentPage,
      limit: pageSize,
    });

    return successHandler('success', { documents, unreadCount, paginated });
  }

  async markAllAsRead(userId: string) {
    try {
      await this.notificationModel
        .updateMany(
          { userId: new Types.ObjectId(userId), read: false },
          { $set: { read: true } },
        )
        .exec();
      return successHandler('All notifications marked as read.');
    } catch (error) {
      throw error;
    }
  }

  async deleteNotification(id: Types.ObjectId, session = null) {
    try {
      await this.notificationModel
        .findByIdAndDelete(id)
        .session(session)
        .exec();
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async getFcmToken(userId: Types.ObjectId | string): Promise<any> {
    const user = await this.userModel.findById(userId).select('firebasetoken');
    return user ? user.firebasetoken : null;
  }

  async sendPushNotification(
    userId: Types.ObjectId | string,
    title: string,
    body: string,
    icon?: string,
    webCategory: string | null = null,
    routeId: string | null = null,
  ) {
    try {
      const fcmToken = await this.getFcmToken(userId);
      if (fcmToken) {
        if (routeId) {
          routeId = routeId.toString();
        }
        try {
          const notificationPayload = {
            roomId: 'test',
            roomName: 'RoomName',
            receiverIds: 'testId',
            type: 'data',
          };
          const res = await this.firebaseService.getMessaging().send({
            token: fcmToken,
            // android:{

            //   notification: {

            //   icon:"https://img.freepik.com/free-photo/luxurious-car-parked-highway-with-illuminated-headlight-sunset_181624-60607.jpg"
            //   }
            // },

            notification: {
              title: title,
              body: body,
              imageUrl: ADMIN_LOGO,
            },

            data: {
              notification_type: 'chat',
              navigationId: webCategory || "",
              routeId: routeId || "",
              userId: userId.toString(),
              data: JSON.stringify(notificationPayload),
            },
          });
          console.log('notification send successfully...!!!!', res);
        } catch (error) {
          console.log('notification failed', error);
        }
      }
      return true;
    } catch (error) {
      logger.error(error);
      return error;
    }
  }
}
