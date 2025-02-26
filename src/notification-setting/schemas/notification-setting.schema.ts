import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';

export type NotificationSettingDocument = HydratedDocument<NotificationSetting>;

@Schema({timestamps: true})
export class NotificationSetting {
  @Prop({required: true, ref: 'User'})
  userId: Types.ObjectId;

  @Prop({required: true, default: true})
  newMessage: boolean;

  @Prop({default: true})
  announcements: boolean;

  @Prop({default: true})
  jobPosting: boolean;

  @Prop({default: true})
  statusUpdate: boolean;

  @Prop({default: true})
  connectionRequests: boolean;

  @Prop({default: true})
  connectionAcceptance: boolean;

  @Prop({default: true})
  upcomingAppointment: boolean;

  @Prop({default: true})
  changedAppointments: boolean;

  @Prop({default: true})
  promotions: boolean;

  @Prop({default: true})
  feature: boolean;

  @Prop({default: true})
  feedbackRequests: boolean;

  @Prop({default: true})
  renewal: boolean;

  @Prop({default: true})
  paymentTransactions: boolean;
}

export const NotificationSettingSchema =
  SchemaFactory.createForClass(NotificationSetting);
