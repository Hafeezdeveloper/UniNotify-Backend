import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsNotEmpty, IsString, ArrayNotEmpty} from 'class-validator';

export class OperatorEmailSenderDto {
  @ApiProperty({
    description: 'Array of user IDs to whom the email should be sent',
    example: ['6723180abbbef9e137ca72cf', '67231828bbbef9e137ca72dd'],
  })
  @IsArray({message: 'User IDs should be an array'})
  @ArrayNotEmpty({message: 'User IDs array cannot be empty'})
  @IsString({each: true, message: 'Each user ID should be a string'})
  userIds: string[];

  @ApiProperty({
    description: 'Subject of the email',
    example: 'Important Update',
  })
  @IsString({message: 'Subject must be a string'})
  @IsNotEmpty({message: 'Subject is required'})
  subject: string;

  @ApiProperty({
    description: 'Message content of the email',
    example: 'This is an important update regarding your account.',
  })
  @IsString({message: 'Message must be a string'})
  @IsNotEmpty({message: 'Message is required'})
  message: string;
}

export class AllUserEmailSenderDto {
  @ApiProperty({
    description: 'Subject of the email',
    example: 'Important Update',
  })
  @IsString({message: 'Subject must be a string'})
  @IsNotEmpty({message: 'Subject is required'})
  subject: string;

  @ApiProperty({
    description: 'Message content of the email',
    example: 'This is an important update regarding your account.',
  })
  @IsString({message: 'Message must be a string'})
  @IsNotEmpty({message: 'Message is required'})
  message: string;
}
