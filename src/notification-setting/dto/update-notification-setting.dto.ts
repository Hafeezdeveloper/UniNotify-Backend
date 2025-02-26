import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsOptional} from 'class-validator';

export class UpdateNotificationSettingDto {
  @ApiProperty({description: 'New message notifications', required: false})
  @IsOptional()
  @IsBoolean()
  newMessage?: boolean;

  @ApiProperty({description: 'Announcements notifications', required: false})
  @IsOptional()
  @IsBoolean()
  announcements?: boolean;

  @ApiProperty({description: 'Job posting notifications', required: false})
  @IsOptional()
  @IsBoolean()
  jobPosting?: boolean;

  @ApiProperty({
    description: 'Job status update notifications',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  statusUpdate?: boolean;

  @ApiProperty({
    description: 'Connection requests notifications',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  connectionRequests?: boolean;

  @ApiProperty({
    description: 'Connection acceptance notifications',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  connectionAcceptance?: boolean;

  @ApiProperty({
    description: 'Upcoming appointment notifications',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  upcomingAppointment?: boolean;

  @ApiProperty({
    description: 'Changed appointments notifications',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  changedAppointments?: boolean;

  @ApiProperty({description: 'Promotions notifications', required: false})
  @IsOptional()
  @IsBoolean()
  promotions?: boolean;

  @ApiProperty({description: 'Feature notifications', required: false})
  @IsOptional()
  @IsBoolean()
  feature?: boolean;

  @ApiProperty({
    description: 'Feedback requests notifications',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  feedbackRequests?: boolean;

  @ApiProperty({description: 'Renewal notifications', required: false})
  @IsOptional()
  @IsBoolean()
  renewal?: boolean;

  @ApiProperty({
    description: 'Payment transactions notifications',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  paymentTransactions?: boolean;
}
