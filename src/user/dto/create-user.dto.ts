import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  MinLength,
  MaxLength,
  IsDateString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { roleEnum, vMsg } from 'src/libaray/constants/app.constants';

export enum GenderEnum {
  FEMALE = 'female',
  MALE = 'male',
  OTHER = 'other',
}

export class RegisterUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  firstName: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  lastName: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@yopmail.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: vMsg.req })
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  email: string;


  @ApiPropertyOptional({
    description: 'australian bussiness number',
    example: '7755-123-4211',
  })
  @IsString()
  @IsOptional()
  roleNumber: string;


  @ApiProperty({
    description: 'Password for the user',
    example: 'Secret@123',
  })
  @IsString({ message: vMsg.str })
  @IsStrongPassword({}, { message: vMsg.invalidPassword })
  @IsNotEmpty({ message: vMsg.req })
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'provider',
    enum: roleEnum,
  })
  @IsEnum(roleEnum)
  @IsNotEmpty({ message: vMsg.req })
  role: string;

}

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@yopmail.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: vMsg.req })
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  email: string;

  @ApiProperty({
    description: 'Password for the user',
    example: 'Secret@123',
  })
  @IsString({ message: vMsg.str })
  @IsNotEmpty({ message: vMsg.req })
  password: string;

  @ApiPropertyOptional({
    description: 'Keep me logged in',
    example: false,
  })
  @IsBoolean({ message: vMsg.bool })
  @IsOptional()
  keepMeloggedIn?: boolean;

  @ApiPropertyOptional({
    description: 'FCM Token for mobile Login',
    example:
      'fsq-YuVQQPeqJaexNUoW5d:APA91bHZASD85UwkEByT5R7ziL8pXHdSTvE6Te1cBOR7W6NWn8WZ3clNFrsN99tM_8hXvfdli6RIDGn-AI5IG02XT4A3-KMYG2W8T9-78Z25heTxhiznrKh-rmZ3pRszVhn8YdErvXYr',
  })
  @IsString({ message: vMsg.str })
  @IsOptional()
  fcmToken?: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@yopmail.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: vMsg.req })
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  email: string;

  @ApiProperty({
    description: 'OTP for the user',
    example: '1234',
  })
  @IsString({ message: vMsg.str })
  @IsNotEmpty({ message: vMsg.req })
  otp: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@yopmail.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: vMsg.req })
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  email: string;

  @ApiProperty({
    description: 'OTP for the user',
    example: '1234',
  })
  @IsString({ message: vMsg.str })
  @IsNotEmpty({ message: vMsg.req })
  otp: string;

  @ApiProperty({
    description: 'New password',
    example: 'Secret@123',
  })
  @IsString({ message: vMsg.str })
  @IsStrongPassword({}, { message: vMsg.invalidPassword })
  @IsNotEmpty({ message: vMsg.req })
  newPassword: string;
}

export class UpdatePasswordDto {
  @ApiProperty({ description: 'The old password of the user' })
  @IsString({ message: 'Old password must be a string' })
  @IsNotEmpty({ message: 'Old password is required' })
  readonly oldPassword: string;

  @ApiProperty({ description: 'The new password of the user' })
  @IsString({ message: 'New password must be a string' })
  @IsStrongPassword()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6, { message: 'value must be at least 6 characters long' })
  @MaxLength(20, { message: 'value must not exceed 20 characters ' })
  readonly newPassword: string;
}

export class UpdateEmailDto {
  @ApiProperty({ description: 'The current email of the user' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  readonly currentEmail: string;

  @ApiProperty({ description: 'The new email of the user' })
  @IsString({ message: vMsg.str })
  @IsEmail()
  @IsNotEmpty({ message: vMsg.req })
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  readonly newEmail: string;
}

export class UpdateDescriptionDto {
  @ApiProperty({ description: 'profile about me' })
  @MaxLength(2600, { message: 'Value must be at most 2600 characters long.' })
  @IsString({ message: vMsg.str })
  @IsNotEmpty({ message: vMsg.req })
  readonly description: string;
}

export class UpdateSummaryDto {
  @ApiProperty({ description: 'profile headline' })
  @IsString({ message: vMsg.str })
  @MaxLength(100, { message: 'Value must be at most 100 characters long.' })
  @IsNotEmpty({ message: vMsg.req })
  readonly summary: string;
}

export class ImageDto {
  @ApiProperty({
    description: 'image file',
    type: 'string',
    format: 'binary',
  })
  image: any;
}

export class UpdateAccountDetailsDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  firstName?: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Provider Category of the user',
    example: 'allied health',
    enum: ['allied health', 'general', 'other'],
  })
  @IsString({ message: 'Role category must be a string' })
  @IsOptional()
  roleCategory?: string;

  @ApiProperty({
    description: 'Date of Birth of the user',
    example: '1990-01-01',
  })
  @IsOptional()
  dateofbirth?: string;

  @ApiProperty({
    description: 'Gender of the user',
    example: 'male',
    enum: GenderEnum,
  })
  // @IsEnum(GenderEnum, {message: 'Gender must be either female, male, or other'})
  @IsOptional()
  gender?: GenderEnum;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '1234567890',
    maxLength: 10,
  })
  @IsString({ message: 'Phone number must be a string' })
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @IsOptional()
  phonenumber?: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, Apt 4B',
  })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'suburb of the user',
    example: 'new york city',
  })
  @IsString({ message: 'suburb must be a string' })
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  suburb?: string;

  @ApiProperty({
    description: 'State of the user',
    example: 'New York',
  })
  @IsString({ message: 'State must be a string' })
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'Postal code of the user',
    example: '1235',
  })
  @IsString({ message: 'Postal code must be a string' })
  @Length(4, 4, { message: 'Postal code must be 4 characters' })
  @IsOptional()
  postCode?: string;
}

export class UpdateSocialLinksDto {
  @ApiProperty({
    description: 'Facebook URL',
    example: 'https://facebook.com/example',
    required: false,
  })
  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @ApiProperty({
    description: 'Instagram URL',
    example: 'https://instagram.com/example',
    required: false,
  })
  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @ApiProperty({
    description: 'LinkedIn URL',
    example: 'https://linkedin.com/in/example',
    required: false,
  })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiProperty({
    description: 'WhatsApp URL',
    example: 'https://wa.me/1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  whatsappUrl?: string;
}

export class UpdatePreferencesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  preferencelgbtq?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  preferencemale?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  preferencefemale?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  preferencenopet?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  preferencenonsmoker?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  noPreferences?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  personalityPetFriendly?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  personalitySmoker?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hobbyCooking?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hobbyMusic?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hobbySports?: boolean;
}

export class DeactivateAccountDto {
  @ApiProperty({
    description: 'The password of the user',
    example: 'yourpassword123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class DeleteAccountDto {
  @ApiProperty({
    description: 'Password for verification',
    example: 'Secret@123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class EmailDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: vMsg.email })
  @IsNotEmpty({ message: vMsg.req })
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  email: string;
}
