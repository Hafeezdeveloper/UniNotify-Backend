import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import {vMsg} from '../../lib/constants/app.constants';
import {Transform} from 'class-transformer';

export class CreateOperatorDto {
  @ApiProperty({
    description: 'First name of the operator',
    example: 'John',
  })
  @IsString({message: vMsg.str})
  @IsNotEmpty({message: vMsg.req})
  firstName: string;

  @ApiProperty({
    description: 'Last name of the operator',
    example: 'Doe',
  })
  @IsString({message: vMsg.str})
  @IsNotEmpty({message: vMsg.req})
  lastName: string;

  @ApiProperty({
    description: 'Username of the operator',
    example: 'johndoe',
  })
  @IsString({message: vMsg.str})
  @IsNotEmpty({message: vMsg.req})
  userName: string;

  @ApiProperty({
    description: 'Email of the operator',
    example: 'john.doe@yopmail.com',
  })
  @IsEmail()
  @IsNotEmpty({message: vMsg.req})
  @Transform(({value}) => value?.toLowerCase(), {toClassOnly: true})
  email: string;

  @ApiProperty({
    description: 'Password of the operator',
    example: 'Secret@123',
  })
  @IsString({message: vMsg.str})
  @IsStrongPassword({}, {message: vMsg.invalidPassword})
  @IsNotEmpty({message: vMsg.req})
  password: string;

  @ApiPropertyOptional({
    description: 'Phone number of the operator',
    example: '1234567890',
  })
  @IsString({message: vMsg.str})
  @Length(10, 10, {message: 'Value must be exactly 10 digits'})
  @IsOptional()
  phonenumber?: string;

  @ApiProperty({
    description: 'Admin type of the operator',
    example: 'admin',
  })
  @IsString({message: vMsg.str})
  @IsNotEmpty({message: vMsg.req})
  adminType: string;

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

export class OperatorLoginDto {
  @ApiProperty({
    description: 'username of the user',
    example: 'user123',
  })
  @IsNotEmpty({message: vMsg.req})
  userName: string;

  @ApiProperty({
    description: 'Password for the user',
    example: 'Secret@123',
  })
  @IsString({message: vMsg.str})
  @IsNotEmpty({message: vMsg.req})
  password: string;

  @ApiPropertyOptional({
    description: 'Keep me logged in',
    example: false,
  })
  @IsBoolean({message: vMsg.bool})
  @IsOptional()
  keepMeloggedIn?: boolean;
}

export class TwoFactorDto {
  @ApiProperty({
    description: 'username of the user',
    example: 'user123',
  })
  @IsNotEmpty({message: vMsg.req})
  userName: string;

  @ApiProperty({
    description: 'OTP for the user',
    example: '1234',
  })
  @IsString({message: vMsg.str})
  @IsNotEmpty({message: vMsg.req})
  otp: string;
}

export class ResendLoginOtpDto {
  @ApiProperty({
    description: 'username of the user',
    example: 'user123',
  })
  @IsNotEmpty({message: vMsg.req})
  @IsString({message: vMsg.str})
  userName: string;

  // Add other fields if needed
}
