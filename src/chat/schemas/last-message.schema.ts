import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';

export type LastMessageDocument = HydratedDocument<LastMessage>;

@Schema({timestamps: true})
export class LastMessage {
  @Prop({required: true})
  uuid: string;

  @Prop({required: true, ref: 'User', index: true})
  userId: Types.ObjectId;

  @Prop({required: true})
  lastMessage: string;

  @Prop({required: true})
  lastMessageTime: Date;

  @Prop({required: true})
  lastMessageType: string;

  @Prop({required: true, ref: 'User', index: true})
  lastMessageSendBy: Types.ObjectId;

  @Prop({default: false})
  isBlocked: boolean;
}

export const LastMessageSchema = SchemaFactory.createForClass(LastMessage);
