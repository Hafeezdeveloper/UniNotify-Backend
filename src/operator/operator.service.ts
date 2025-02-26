import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Operator, OperatorDocument } from './schemas/operator.schema';
import { CreateOperatorDto, OperatorLoginDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import {
  failureHandler,
  getDocumentTotal,
  Pagination,
  paginationParams,
  PaginationResult,
  successHandler,
} from 'src/lib/helpers/utility.helpers';
import {
  emailSub,
  emailTemplates,
  StatusEnum,
  USER_NOT_FOUND,
} from 'src/lib/constants/app.constants';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import {
  AllUserEmailSenderDto,
  OperatorEmailSenderDto,
} from './dto/emailSendDto';
import { EmailRecords, EmailRecordsDocuments } from './schemas/emailOperator.schema';
import { User, UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class OperatorService {
  constructor(
    @InjectModel(Operator.name) private operatorModel: Model<OperatorDocument>,
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @InjectModel(EmailRecords.name)
    private emailRecordModel: Model<EmailRecordsDocuments>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
    private readonly authService: AuthService,
  ) { }

  async create(createOperatorDto: CreateOperatorDto): Promise<Operator> {
    const createdOperator = new this.operatorModel(createOperatorDto);
    return createdOperator.save();
  }

  async findById(id: string) {
    return this.operatorModel.findById(id).exec();
  }

  async findOneUserName(userName: string) {
    const checkExisting = await this.operatorModel
      .findOne({ userName: userName })
      .select('+password');
    if (checkExisting) {
      return checkExisting;
    }
    return null;
  }

  async findEmail(email: string) {
    const checkExisting = await this.operatorModel
      .findOne({ email: email })
      .select('-password');
    if (checkExisting) {
      return true;
    }
    return false;
  }

  async findUsername(username: string) {
    const checkExisting = await this.operatorModel
      .findOne({ userName: username })
      .select('-password');
    if (checkExisting) {
      return true;
    }
    return false;
  }

  async update(
    id: string,
    updateOperatorDto: UpdateOperatorDto,
  ): Promise<Operator | null> {
    if (updateOperatorDto.email) {
      const existingOperator = await this.operatorModel
        .findOne({ email: updateOperatorDto.email })
        .select('-password');

      if (existingOperator && existingOperator._id.toString() !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateOperatorDto.userName) {
      const existingOperator = await this.operatorModel
        .findOne({ userName: updateOperatorDto.userName })
        .select('-password');

      if (existingOperator && existingOperator._id.toString() !== id) {
        throw new ConflictException('username already exists');
      }
    }

    const updatedOperator = await this.operatorModel
      .findByIdAndUpdate(id, updateOperatorDto, { new: true })
      .exec();
    if (!updatedOperator) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return updatedOperator;
  }

  async toggleStatus(id: string): Promise<Operator | null> {
    const updatedOperator = await this.operatorModel
      .findByIdAndDelete(id)
      .exec();
    // .findByIdAndUpdate(
    //     id,
    //     { $set: { status: newStatus } },
    //     { new: true, runValidators: true },
    // ).exec();

    return updatedOperator;
  }

  async adminLogin(operatorLoginDto: OperatorLoginDto) {
    const operatorsDetailsCheck = await this.findOneUserName(
      operatorLoginDto.userName,
    );
    if (!operatorsDetailsCheck) {
      return failureHandler(404, USER_NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(
      operatorLoginDto.password,
      operatorsDetailsCheck.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    if (operatorsDetailsCheck.status === StatusEnum.INACTIVE) {
      return failureHandler(423, 'Operator account deleted by admin');
    }

    const otpData = await this.otpService.setOtp(operatorsDetailsCheck._id);

    const SuperAdminEmail = await this.operatorModel.findOne({
      isSuperAdmin: true,
    });
    if (!SuperAdminEmail) {
      return failureHandler(404, USER_NOT_FOUND);
    }
    await this.mailService.sendEmail(
      SuperAdminEmail.email,
      emailSub.twoFactorAuthentication,
      emailTemplates.twoFactorAuthentication,
      { adminEmail: operatorsDetailsCheck.email, otpToken: otpData.otp },
    );
    return successHandler('success');
  }

  async faAuth(userName: string) {
    const operatorsDetailsCheck = await this.findOneUserName(userName);
    if (!operatorsDetailsCheck) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    const expiresIn = 24 * 60 * 60;
    // if (operatorLoginDto.keepMeloggedIn) {
    //     expiresIn = '7d'
    // }

    const token = await this.authService.generateToken({
      userId: operatorsDetailsCheck._id,
      userEmail: operatorsDetailsCheck.email,
      role: operatorsDetailsCheck.isSuperAdmin
        ? 'superAdmin'
        : operatorsDetailsCheck.adminType,
      // isMember: false,
      expiresIn: expiresIn,
      mobileSession: false,
    });

    const operatorsDetails = {
      fullName: operatorsDetailsCheck.fullName,
      isSuperAdmin: operatorsDetailsCheck.isSuperAdmin,
      adminType: operatorsDetailsCheck.adminType,
      status: operatorsDetailsCheck.status,
      module1read: operatorsDetailsCheck.module1read,
      module1write: operatorsDetailsCheck.module1write,
      module2read: operatorsDetailsCheck.module2read,
      module2write: operatorsDetailsCheck.module2write,
      module3read: operatorsDetailsCheck.module3read,
      module3write: operatorsDetailsCheck.module3write,
      module4read: operatorsDetailsCheck.module4read,
      module4write: operatorsDetailsCheck.module4write,
    };

    return successHandler('login success', { token, operatorsDetails });
  }

  async getAllOperators(
    adminType?: string,
    name?: string,
    page?: number,
    limit?: number,
  ): Promise<{ documents: Operator[]; paginated: PaginationResult }> {
    const { currentPage, pageSize, skip } = paginationParams(page, limit);
    const matchConditions: any = {};

    if (name) {
      matchConditions.fullName = { $regex: name, $options: 'i' };
    }

    if (adminType) {
      matchConditions.adminType = { $regex: adminType, $options: 'i' };
    }

    const pipeline: any[] = [
      { $match: matchConditions },
      { $match: { status: 'active', isSuperAdmin: false } },
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'userId',
          as: 'sessions',
        },
      },
      { $unwind: { path: '$sessions', preserveNullAndEmptyArrays: true } },
      { $sort: { 'sessions.createdAt': -1 } },
      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$firstName' },
          fullName: { $first: '$fullName' },
          lastName: { $first: '$lastName' },
          status: { $first: '$status' },
          userName: { $first: '$userName' },
          createdAt: { $first: '$createdAt' },
          email: { $first: '$email' },
          phonenumber: { $first: '$phonenumber' },
          adminType: { $first: '$adminType' },
          lastLogin: { $first: '$sessions.createdAt' },
          module1read: { $first: '$module1read' },
          module2read: { $first: '$module2read' },
          module3read: { $first: '$module3read' },
          module4read: { $first: '$module4read' },
          module1write: { $first: '$module1write' },
          module2write: { $first: '$module2write' },
          module3write: { $first: '$module3write' },
          module4write: { $first: '$module4write' },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          documents: [{ $skip: skip }, { $limit: Number(pageSize) }],
          totalCount: [{ $count: 'value' }],
        },
      },
    ];

    const [result] = await this.operatorModel.aggregate(pipeline).exec();

    const { documents, totalCount } = result;
    const totalItems = getDocumentTotal(totalCount);
    const paginated = Pagination({
      totalItems,
      page: currentPage,
      limit: pageSize,
    });

    return { documents, paginated };
  }

  async resendOtp(userName: string) {
    const operatorsDetailsCheck = await this.findOneUserName(userName);
    if (!operatorsDetailsCheck) {
      return failureHandler(404, USER_NOT_FOUND);
    }

    const otpData = await this.otpService.setOtp(operatorsDetailsCheck._id);

    await this.mailService.sendEmail(
      operatorsDetailsCheck.email,
      emailSub.twoFactorAuthentication,
      emailTemplates.twoFactorAuthentication,
      { adminEmail: operatorsDetailsCheck.email, otpToken: otpData.otp },
    );
    return successHandler('email send');
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.operatorModel
      .findById(new Types.ObjectId(userId))
      .select('+password');
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (!oldPassword || !user.password) {
      return failureHandler(
        401,
        'current password or user password is missing',
      );
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return failureHandler(401, 'current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return successHandler('Password Updated Successfully');
  }

}
