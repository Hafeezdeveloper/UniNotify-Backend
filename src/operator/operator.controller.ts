import {
  AllUserEmailSenderDto,
  OperatorEmailSenderDto,
} from './dto/emailSendDto';
import {
  Controller,
  Post,
  Body,
  ConflictException,
  Param,
  NotFoundException,
  Put,
  BadRequestException,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import {
  CreateOperatorDto,
  OperatorLoginDto,
  ResendLoginOtpDto,
  TwoFactorDto,
} from './dto/create-operator.dto';
import { OperatorService } from './operator.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { OtpService } from 'src/otp/otp.service';
import { USER_NOT_FOUND } from 'src/lib/constants/app.constants';
import {
  createApiResponse,
  failureHandler,
  successHandler,
} from 'src/lib/helpers/utility.helpers';
import { UpdatePasswordDto } from 'src/user/dto/create-user.dto';

@ApiTags('Admin Operator')
@Controller('operator')
export class OperatorController {
  constructor(
    private readonly operatorService: OperatorService,
    private readonly otpService: OtpService,
  ) { }

  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new operator' })
  @createApiResponse(201, 'The operator has been successfully created', true)
  @createApiResponse(409, 'Email already exists', false)
  @createApiResponse(409, 'username already exists', false)
  @createApiResponse(422, 'formValidations', false)
  @createApiResponse(500, 'internal server error', false)
  @ApiBody({ type: CreateOperatorDto })
  async createOperator(@Body() createOperatorDto: CreateOperatorDto) {
    if (await this.operatorService.findEmail(createOperatorDto.email)) {
      throw new ConflictException('Email already exists');
    }
    if (await this.operatorService.findUsername(createOperatorDto.userName)) {
      throw new ConflictException('username already exists');
    }
    return this.operatorService.create(createOperatorDto);
  }

  @Post('/login')
  @createApiResponse(201, 'success', true)
  @createApiResponse(404, 'user not found', false)
  @ApiOperation({ summary: 'Operator Login' })
  @ApiBody({ type: OperatorLoginDto })
  async login(@Body() operatorLoginDto: OperatorLoginDto) {
    return this.operatorService.adminLogin(operatorLoginDto);
  }

  @Post('/two-fa')
  @ApiOperation({ summary: 'Two factor authentication ' })
  @ApiBody({ type: TwoFactorDto })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async twoFactorVerify(@Body() twoFactorDto: TwoFactorDto) {
    const userNameCheck = await this.operatorService.findOneUserName(
      twoFactorDto.userName,
    );
    if (!userNameCheck) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    const isValidOtp = await this.otpService.verifyOtp(
      userNameCheck._id,
      twoFactorDto.otp,
    );
    if (!isValidOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    return await this.operatorService.faAuth(userNameCheck.userName);
  }

  @Post('/send-otp')
  @ApiOperation({ summary: 'resend two factor otp token' })
  @ApiBody({ type: ResendLoginOtpDto })
  @createApiResponse(200, 'email send', true)
  @createApiResponse(404, USER_NOT_FOUND, false)
  async sendOtp(@Body() resendLoginOtpDto: ResendLoginOtpDto) {
    return await this.operatorService.resendOtp(resendLoginOtpDto.userName);
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing operator' })
  @createApiResponse(200, 'operator updated', true)
  @createApiResponse(404, USER_NOT_FOUND, false)
  @createApiResponse(409, 'Email already exists', false)
  @createApiResponse(500, 'internal server error', false)
  @ApiBody({ type: UpdateOperatorDto })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the operator to update',
  })
  async updateOperator(
    @Param('id') id: string,
    @Body() updateOperatorDto: UpdateOperatorDto,
  ) {
    const updatedOperator = await this.operatorService.update(
      id,
      updateOperatorDto,
    );

    if (!updatedOperator) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return successHandler('operator updated', updatedOperator);
  }

  @Put('deactivate/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate an operator' })
  @createApiResponse(200, 'Operator {status} successfully', true)
  @createApiResponse(401, 'Unauthorized', false)
  @createApiResponse(404, USER_NOT_FOUND, false)
  @createApiResponse(500, 'internal server error', false)
  async deactivateOperator(@Param('id') id: string) {
    const operatorDetails = await this.operatorService.findById(id);
    if (!operatorDetails) {
      return failureHandler(404, USER_NOT_FOUND);
    }

    if (operatorDetails.isSuperAdmin) {
      return failureHandler(401, 'Selected operator cannot be deactivated');
    }

    const newStatus =
      operatorDetails.status === 'active' ? 'inactive' : 'active';

    const result = await this.operatorService.toggleStatus(id);
    if (!result) {
      return failureHandler(404, 'Operator not found.');
    }

    return successHandler(`Operator ${newStatus} successfully`);
  }

  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all operators with optional filters' })
  @createApiResponse(200, 'Operators retrieved successfully', true)
  @createApiResponse(500, 'Internal Server Error', false)
  @ApiQuery({
    name: 'adminType',
    required: false,
    type: String,
    description: 'Filter by operator role',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by full name',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  async getAllOperators(
    @Query('adminType') adminType?: string,
    @Query('name') name?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.operatorService.getAllOperators(adminType, name, page, limit);
  }

  @Put('update-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @createApiResponse(200, 'Password updated successfully', true)
  @createApiResponse(400, 'Invalid OTP or password update failed', false)
  async updatePassword(
    @Body() updatePassword: UpdatePasswordDto,
    @Req() req: any,
  ) {
    const { user } = req;
    return await this.operatorService.updatePassword(
      user._id,
      updatePassword.oldPassword,
      updatePassword.newPassword,
    );
  }


}
