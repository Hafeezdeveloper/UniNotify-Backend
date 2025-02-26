import {Document} from 'mongoose';

export interface IOtp extends Document {
  readonly userId: string;
  readonly otpType: string;
  readonly otp: number;
}
