// src/users/dto/update-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StatusEnum } from 'src/lib/constants/app.constants';

export class UpdateUserStatusDto {
  @ApiProperty({
    enum: StatusEnum,
    description: 'New status for the user',
    example: StatusEnum.APPROVED
  })
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: string;

}