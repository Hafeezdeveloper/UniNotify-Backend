import {Controller, Get, Post, Query, Req} from '@nestjs/common';
import {NotificationsService} from './notifications.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all notifications for a user'})
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Notifications retrieved successfully',
        Notification: [],
        unreadCount: 5,
        totalCount: 10,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error retrieving notifications',
    schema: {
      example: {
        success: false,
        message: 'Error retrieving notifications',
      },
    },
  })
  async getNotifications(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const {user} = req;
    const userId = user._id;

    return this.notificationsService.getNotifications(userId, page, limit);
  }

  @Post('mark-as-read')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Mark all notifications as read'})
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
    schema: {
      example: {
        success: true,
        message: 'All notifications marked as read.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No unread notifications found or already marked as read',
    schema: {
      example: {
        success: false,
        message: 'No unread notifications found or already marked as read.',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to mark notifications as read',
    schema: {
      example: {
        success: false,
        message: 'Failed to mark notifications as read',
        error: 'Error message',
      },
    },
  })
  async markAsRead(@Req() req: any) {
    const {user} = req;
    return await this.notificationsService.markAllAsRead(user._id);
  }
}
