import {Body, Controller, Get, Put, Req} from '@nestjs/common';
import {NotificationSettingService} from './notification-setting.service';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {UpdateNotificationSettingDto} from './dto/update-notification-setting.dto';
import {
  createApiResponse,
  failureHandler,
} from '../lib/helpers/utility.helpers';

@ApiTags('Notification Settings')
@Controller('notification-settings')
export class NotificationSettingController {
  constructor(
    private readonly notificationSettingService: NotificationSettingService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get user notification settings'})
  @createApiResponse(200, 'Notification Setting Retrieved Successfully', true, {
    settings: {
      userId: '605c72ef9f1b2c3b88d8e5a1',
      emailNotifications: true,
      pushNotifications: true,
    },
  })
  @createApiResponse(404, 'No Notification settings found', false)
  @createApiResponse(500, 'internal server error', false)
  async getNotificationSetting(@Req() req: any) {
    const {user} = req;
    const settings =
      await this.notificationSettingService.getNotificationSetting(user._id);

    if (!settings) {
      return failureHandler(404, 'No Notification settings found');
    }
    return {
      success: true,
      message: 'Notification Setting Retrieved Successfully',
      settings,
    };
  }

  @Put('update')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Update user notification settings'})
  @createApiResponse(200, 'Notification Setting Updated Successfully', true, {
    settings: {
      userId: '605c72ef9f1b2c3b88d8e5a1',
      emailNotifications: true,
      pushNotifications: true,
    },
  })
  @createApiResponse(404, 'No Notification settings found', false)
  @createApiResponse(500, 'internal server error', false)
  async updateNotificationSetting(
    @Req() req: any,
    @Body() updateNotificationSettingDto: UpdateNotificationSettingDto,
  ) {
    const {user} = req;
    const settings =
      await this.notificationSettingService.updateNotificationSetting(
        user._id,
        updateNotificationSettingDto,
      );
    if (!settings) {
      return {
        success: false,
        message: 'No Notification settings found',
      };
    }

    return {
      success: true,
      message: 'Notification Setting Updated Successfully',
      settings,
    };
  }
}
