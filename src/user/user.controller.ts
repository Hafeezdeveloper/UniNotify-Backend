import { Body, ConflictException, Controller, Get, NotFoundException, Param, Post, Put, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { EmailDto, LoginDto, RegisterUserDto, VerifyOtpDto } from './dto/create-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PROFILE_PREFIX } from 'src/libaray/constants/app.constants';
import { Express } from 'express';
import { createFileUploadConfig } from 'src/config/multerConfig';
import { createApiResponse } from 'src/libaray/helpers/utility.helpers';
import { Response } from 'express';
import { LINK, RESET, USER_NOT_FOUND } from 'src/lib/constants/app.constants';
import { OtpService } from 'src/otp/otp.service';
import { AcademicService } from './academic.service';
import { UpdateUserStatusDto } from './dto/update-status.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService, private readonly otpService: OtpService, private readonly academicService: AcademicService) { }

    @Post('createUser')
    @UseInterceptors(
        FileFieldsInterceptor(
            [{ name: 'image', maxCount: 1 }],
            createFileUploadConfig({ prefix: PROFILE_PREFIX }),
        ),
    )
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create new free user (provider or participant)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
                email: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                password: { type: 'string' },
                role: { type: 'string' },
            },
        },
    })
    async create(
        @UploadedFiles() files: { image?: Express.Multer.File[] },
        @Body() registerUserDto: RegisterUserDto
    ) {
        const mainImagePath = files?.image?.[0] as Express.Multer.File & {
            location?: string;
        };

        console.log("Uploaded File: ", mainImagePath.location);
        let finalDtp = {
            ...registerUserDto,
            image: mainImagePath.location
        }
        if (await this.userService.findEmail(registerUserDto.email)) {
            throw new ConflictException('Email already exists');
        }

        return this.userService.create(finalDtp);
    }


    @Get('verifyLink')
    @ApiOperation({ summary: 'Redirection for email verification' })
    @createApiResponse(201, 'redirects to login page', true)
    @createApiResponse(404, 'redirects to page 404', false)
    async verifyLink(@Query('token') token: string, @Res() res: Response) {
        return this.userService.verifyLink(token, res);
    }


    @Post('/login')
    @ApiOperation({ summary: 'User Login' })
    @createApiResponse(201, 'login success', true, {
        token: 'access_token',
        userDetails: {
            fullName: 'John Doe',
            profileImageUrl: 'image url',
            coverImageUrl: 'cover image url',
            status: 'active',
            roleCategory: 'participant',
            isVerified: true,
            totalRatings: 0,
            totalReviews: 0,
        },
    })
    @createApiResponse(404, USER_NOT_FOUND, false, { error: 'not found' })
    @createApiResponse(403, 'verify your email', false)
    @createApiResponse(401, 'unauthorized', false)
    @ApiBody({ type: LoginDto })
    async login(@Body() logindto: LoginDto) {
        return this.userService.login(logindto);
    }

    @Post('/resendLink')
    @ApiOperation({ summary: 'Resend Verification Link' })
    @ApiBody({ type: EmailDto })
    @createApiResponse(201, 'success', true)
    @createApiResponse(404, USER_NOT_FOUND, false, { error: 'not found' })
    async resendVerifyLink(@Body() emailDto: EmailDto) {
        const { email } = emailDto;
        const emailCheck = await this.userService.findOneEmail(email);

        if (!emailCheck) {
            throw new NotFoundException(USER_NOT_FOUND);
        }
        return await this.userService.resendOtp(email, LINK);
    }

    @Post('/send-otp')
    @ApiOperation({ summary: 'send Password reset otp' })
    @ApiBody({ type: EmailDto })
    @createApiResponse(201, 'success', true)
    @createApiResponse(404, 'email not found', false, { error: 'not found' })
    async sendOtp(@Body() emailDto: EmailDto) {
        const { email } = emailDto;
        const emailCheck = await this.userService.findOneEmail(email);
        if (!emailCheck) {
            throw new NotFoundException('email not found');
        }
        return await this.userService.resendOtp(email, RESET);
    }

    @Post('/verify-otp')
    @ApiOperation({ summary: 'Verify reset password OTP ' })
    @ApiBody({ type: VerifyOtpDto })
    @createApiResponse(201, 'otp verified', true, {})
    @createApiResponse(400, 'invalid otp', false)
    @createApiResponse(404, USER_NOT_FOUND, false, { error: 'not found' })
    async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
        const emailCheck = await this.userService.findOneEmail(verifyOtpDto.email);
        if (!emailCheck) {
            throw new NotFoundException(USER_NOT_FOUND);
        }
        return await this.otpService.validOtp(emailCheck._id, verifyOtpDto.otp);
    }

    @Get('batches')
    getBatches() {
        return this.academicService.getAllBatches();
    }

    @Get('departments')
    getDepartments() {
        return this.academicService.getAllDepartments();
    }

    @Get('sections')
    getSections() {
        return this.academicService.getAllSections();
    }

    @Get('semesters')
    getSemesters() {
        return this.academicService.getAllSemesters();
    }


    @Get('all')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users for admin with pagination and filters' })
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
    @ApiQuery({
        name: 'type',
        required: false,
        type: String,
        description: 'type',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        type: String,
        description: 'Filter users by status (active, inactive, blocked)',
    })
    @ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Search by name or email',
    })
    @ApiResponse({ status: 200, description: 'List of users returned successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getAllUsersAdmin(
        @Query('status') status?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
        @Query('type') type?: string,
    ) {
        return await this.userService.getAllUsersAdmin(
            status,
            page,
            limit,
            search,
            type
        );
    }


    @Put('status-update/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Approve a pending user' })
    @ApiResponse({ status: 200, description: 'User approved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async approveUser(
        @Param('id') id: string,
        @Body() dto: UpdateUserStatusDto
    ) {
        return this.userService.updateStatus(id, dto);
    }


}
