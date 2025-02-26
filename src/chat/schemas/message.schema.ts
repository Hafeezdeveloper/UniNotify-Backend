import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;
@Schema({timestamps: true})
export class Message {
  @Prop({required: true})
  uuid: string;

  @Prop({required: true, ref: 'User', index: true})
  senderId: Types.ObjectId;

  @Prop({required: true})
  messageBody: string;

  @Prop()
  type: string;

  @Prop()
  fileUrl: string;

  @Prop()
  isRead: boolean;

  @Prop({required: true, ref: 'User', index: true})
  userId: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
