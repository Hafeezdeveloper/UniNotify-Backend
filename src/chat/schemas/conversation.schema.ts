import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({timestamps: true})
export class Conversation {
  @Prop({index: true})
  uuid: string;

  @Prop({required: true, ref: 'User', index: true})
  members: Types.ObjectId[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
