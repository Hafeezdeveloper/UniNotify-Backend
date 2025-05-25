// section.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SectionDocument = Section & Document;

@Schema({ timestamps: true })
export class Section {
   @Prop({ type: Types.ObjectId })
      _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
