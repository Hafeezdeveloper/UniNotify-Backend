import {Types} from 'mongoose';
import {
  NOTIFICATION_ROUTING_ENUM,
  NOTIFICATION_TYPE_ENUM,
} from '../../lib/constants/app.constants';

export interface CreateNotificationDto {
  userId: Types.ObjectId | string;
  title: string;
  icon: string;
  message: string;
  notificationType?: NOTIFICATION_TYPE_ENUM | null;
  routeId?: Types.ObjectId | null | string;
  routing?: NOTIFICATION_ROUTING_ENUM | null; // Adjust this type according to your requirements
  session?: any;
}
