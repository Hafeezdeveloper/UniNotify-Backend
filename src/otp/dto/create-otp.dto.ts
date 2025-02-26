import {IsMongoId} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Types} from 'mongoose';

export class CreateOtpDto {
  @ApiProperty({description: 'ID of User'})
  @IsMongoId()
  readonly userId: Types.ObjectId;
}
