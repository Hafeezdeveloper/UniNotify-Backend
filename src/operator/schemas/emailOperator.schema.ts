import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';

export type EmailRecordsDocuments = HydratedDocument<EmailRecords>;

@Schema({timestamps: true})
export class EmailRecords {
  @Prop({required: true})
  subject: string; // Add properties for email content, subject, etc.

  @Prop({required: true})
  message: string; // Example field for storing template or message content
}
export const EmailRecordsSchema = SchemaFactory.createForClass(EmailRecords);
