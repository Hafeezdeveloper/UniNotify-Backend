// batch.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BatchDocument = Batch & Document;

@Schema({ timestamps: true })
export class Batch {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    year: string;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
