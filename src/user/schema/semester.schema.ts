import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SemesterDocument = Semester & Document;

@Schema({ timestamps: true })
export class Semester {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;
}

export const SemesterSchema = SchemaFactory.createForClass(Semester);
