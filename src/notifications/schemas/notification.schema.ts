import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({timestamps: true})
export class Notification {
  @Prop({required: true})
  userId: Types.ObjectId;

  @Prop({required: true})
  message: string;

  @Prop()
  title: string;

  @Prop()
  notificationRoute: string;

  @Prop()
  routeId: string;

  @Prop({default: false})
  read: boolean;

  @Prop({default: false})
  imageUrl: string;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
