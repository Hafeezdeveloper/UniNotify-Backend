import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {
  NotificationSetting,
  NotificationSettingDocument,
} from './schemas/notification-setting.schema';
import {Model, Types} from 'mongoose';
import {UpdateNotificationSettingDto} from './dto/update-notification-setting.dto';

@Injectable()
export class NotificationSettingService {
  constructor(
    @InjectModel(NotificationSetting.name)
    private notificationSettingsModel: Model<NotificationSettingDocument>,
  ) {}

  async getNotificationSetting(
    userId: string,
  ): Promise<NotificationSetting | null> {
    return this.notificationSettingsModel
      .findOne({userId: new Types.ObjectId(userId)})
      .exec();
  }

  async updateNotificationSetting(
    userId: string,
    updateNotificationSettingDto: UpdateNotificationSettingDto,
  ): Promise<NotificationSetting | null> {
    return this.notificationSettingsModel
      .findOneAndUpdate({userId}, updateNotificationSettingDto, {
        new: true,
        runValidators: true,
      })
      .exec();
  }
}
