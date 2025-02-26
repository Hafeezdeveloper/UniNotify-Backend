import {HttpStatus, Injectable} from '@nestjs/common';

import {OtpDocument, Otp} from './schemas/otp.schema';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {
  failureHandler,
  generateOTP,
  successHandler,
} from 'src/lib/helpers/utility.helpers';
import {Types} from 'mongoose';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name)
    private readonly otpModel: Model<OtpDocument>,
  ) {}
  async setOtp(id: Types.ObjectId) {
    const otp = generateOTP();

    const updatedOtp = await this.otpModel.findOneAndUpdate(
      {userId: id},
      {
        $set: {
          otp: otp,
          createdAt: Date.now(),
        },
      },
      {new: true, upsert: true, setDefaultsOnInsert: true},
    );

    return updatedOtp;
  }

  async verifyOtp(userId: Types.ObjectId, otp: string) {
    const otpCheck = await this.otpModel.findOne({userId, otp});
    if (!otpCheck) {
      return false;
    }

    await this.otpModel.deleteOne({_id: otpCheck._id});
    return true;
  }

  async validOtp(userId: Types.ObjectId, otp: string) {
    const otpCheck = await this.otpModel.findOne({userId, otp});
    if (!otpCheck) {
      return failureHandler(HttpStatus.BAD_REQUEST, 'invalid otp');
    }
    return successHandler('otp verified');
  }
}
