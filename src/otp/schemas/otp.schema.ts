import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {OTPExpiry} from '../../lib/constants/app.constants';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({timestamps: true}) // This automatically adds createdAt and updatedAt fields
export class Otp {
  @Prop({required: true})
  userId: Types.ObjectId;

  @Prop({required: true})
  otp: number;

  @Prop({type: Date, default: Date.now, expires: OTPExpiry}) // Document will expire after 5 minutes
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
