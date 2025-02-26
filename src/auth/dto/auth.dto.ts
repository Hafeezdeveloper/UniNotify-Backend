import {Types} from 'mongoose';

export interface GenerateTokenOptions {
  userId: Types.ObjectId;
  userEmail: string;
  role: string;
  // isMember: boolean;
  expiresIn: number; // Optional with default value
  mobileSession?: boolean; // Optional with default value
}
