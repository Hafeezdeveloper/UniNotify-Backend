// department.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
 @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;


    @Prop({})
    name: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
