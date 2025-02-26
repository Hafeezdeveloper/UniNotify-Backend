import {ApiPropertyOptional} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import {vMsg} from '../../lib/constants/app.constants';

export class UpdateOperatorDto {
  @ApiPropertyOptional({
    description: 'First name of the operator',
    example: 'John',
  })
  @IsString({message: vMsg.str})
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the operator',
    example: 'Doe',
  })
  @IsString({message: vMsg.str})
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Username of the operator',
    example: 'johndoe',
  })
  @IsString({message: vMsg.str})
  @IsOptional()
  userName?: string;

  @ApiPropertyOptional({
    description: 'Password of the operator',
    example: 'Secret@123',
  })
  @IsString({message: vMsg.str})
  @IsStrongPassword({}, {message: vMsg.invalidPassword})
  @IsOptional()
  password: string;

  @ApiPropertyOptional({
    description: 'Email of the operator',
    example: 'john.doe@yopmail.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the operator',
    example: '1234567890',
  })
  @IsString({message: vMsg.str})
  @Length(10, 10, {message: 'Value must be exactly 10 digits'})
  @IsOptional()
  phonenumber?: string;

  @ApiPropertyOptional({
    description: 'Admin type of the operator',
    example: 'admin',
  })
  @IsString({message: vMsg.str})
  @IsOptional()
  adminType?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the operator is a super admin',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;

  @ApiPropertyOptional({
    description: 'Module 1 read privilege',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  module1read?: boolean;

  @ApiPropertyOptional({
    description: 'Module 1 write privilege',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  module1write?: boolean;

  @ApiPropertyOptional({
    description: 'Module 2 read privilege',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  module2read?: boolean;

  @ApiPropertyOptional({
    description: 'Module 2 write privilege',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  module2write?: boolean;

  @ApiPropertyOptional({
    description: 'Module 3 read privilege',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  module3read?: boolean;

  @ApiPropertyOptional({
    description: 'Module 3 write privilege',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  module3write?: boolean;

  @ApiPropertyOptional({
    description: 'Module 4 read privilege',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  module4read?: boolean;

  @ApiPropertyOptional({
    description: 'Module 4 write privilege',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  module4write?: boolean;
}
