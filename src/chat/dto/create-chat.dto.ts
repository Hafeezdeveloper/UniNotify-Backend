import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    example: '60d21b4967d0d8992e610c85',
    description: 'The ID of the Reciever',
  })
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({
    example: 'hello, this a new message',
    description: 'message body',
  })
  @IsString()
  @IsNotEmpty()
  messageBody: string;
}

export class SendFileDto {
  @ApiProperty({
    example: '605c72ef9f1b2c3b88d8e5a1',
    description: 'receiver Id',
  })
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({
    type: 'array',
    items: {type: 'string', format: 'binary'},
    description: 'Array of files to upload',
  })
  files: any[];
}
