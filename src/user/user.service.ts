import { BadRequestException, HttpStatus, Injectable, NotFoundException, Query, Res } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import mongoose, { Model, Types } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { LoginDto, RegisterUserDto } from './dto/create-user.dto';
import { ADMIN, emailSub, emailTemplates, FACULTY, STUDENT, TEACHER } from 'src/libaray/constants/app.constants';
import { capitalizeFirstLetter, failureHandler, Pagination, paginationParams, successHandler, toCamelCase } from 'src/libaray/helpers/utility.helpers';
import { AuthService } from 'src/auth/auth.service';
import { OtpService } from 'src/otp/otp.service';
import { logger } from 'src/lib/helpers/utility.logger';
import { Response } from 'express';
import { getDocumentTotal } from 'src/lib/helpers/utility.helpers';
import { ACTIVE, AWAY, LINK, PENDING, RESET, StatusEnum, USER_NOT_FOUND } from 'src/lib/constants/app.constants';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { decode } from 'punycode';
import * as dotenv from 'dotenv';
import { UpdateUserStatusDto } from './dto/update-status.dto';

dotenv.config();

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly authService: AuthService,
        private readonly otpService: OtpService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        @InjectConnection() private readonly connection: mongoose.Connection,
    ) { }

    async create(registerUserDto: any) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            // Correcting the collections object
            const collections = {
                [STUDENT]: this.userModel,
                [TEACHER]: this.userModel,
                [FACULTY]: this.userModel,
                // [ADMIN]: this.,
            };

            const newUser = new this.userModel({ ...registerUserDto, });
            await newUser.save({ session });

            // const sub_collection = { _id: newUser._id };

            // // Ensure `newUser.role` exists in `collections`
            // if (!collections[newUser.role]) {
            //     throw new Error(`Role ${newUser.role} is not valid.`);
            // }
            const otpData = await this.otpService.setOtp(newUser._id);
            const token = this.jwtService.sign(
                { userId: otpData.userId, otp: otpData.otp },
                { secret: process.env.JWT_SECRET },
            );

            // Create the verification link
            const verificationLink = `${process.env.BACKEND_URL}api/user/verifyLink?token=${token}`;
            console.log("verificationLink", verificationLink)
            await this.mailService.sendEmail(
                newUser.email,
                emailSub.sendVerificationLink,
                emailTemplates.sendVerificationLink,
                { firstName: capitalizeFirstLetter(newUser.firstName), verificationLink },
            );

            ///////////
            // const userRoleDetails = new collections[newUser.role](sub_collection);
            // await userRoleDetails.save({ session });
            await session.commitTransaction();
            session.endSession();
            return successHandler('User created successfully', {
                verificationMessage: 'Verification link sent to email',
                receiverId: newUser._id,
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }


    async verifyLink(@Query('token') token: string, @Res() res: Response) {
        try {
            const decoded = await this.authService.verifyToken(token);
            console.log(decoded)
            if (!decoded) {
                throw new BadRequestException('Invalid Token');
            }

            if (await this.otpService.verifyOtp(new Types.ObjectId(decoded.userId), decoded.otp,)) {
                const updatedUser = await this.userModel.findByIdAndUpdate(
                    new Types.ObjectId(decoded.userId),
                    { $set: { isVerified: true, adminNotified: false } },
                    { new: true },
                );

                // const roleCategoryCamelCase = toCamelCase(updatedUser.roleCategory);

                // await this.socketGateway.adminDashboard(SOCKET_EVENTS.ADMIN_STATS, {
                //   [updatedUser.role]: 1,
                // });

                // await this.socketGateway.adminDashboard(SOCKET_EVENTS.ADMIN_STATS, {
                //     [roleCategoryCamelCase]: 1,
                // });

                // await this.mailService.sendEmail(
                //     updatedUser.email,
                //     emailSub.welcomeEmail,
                //     emailTemplates.welcomeEmail,
                //     { firstName: capitalizeFirstLetter(updatedUser.firstName) },
                // );
                console.log("Awd")
                return res.redirect(`${process.env.FRONTEND_URL}`);
            }
            console.log("twi")

            return res.redirect(`${process.env.FRONTEND_URL}s`);
        } catch (error) {
            logger.error(error);
            return res.redirect(`${process.env.FRONTEND_URL}s`);
        }
    }

    async login(logindto: LoginDto) {
        console.log("Awdawd")
        console.log("lerar", logindto)
        const userDetailsCheck = await this.findOneEmailDetails(logindto.email);
        if (!userDetailsCheck) {
            return failureHandler(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
        }

        const passwordMatch = await bcrypt.compare(
            logindto.password,
            userDetailsCheck.password,
        );
        if (!passwordMatch) {
            return failureHandler(HttpStatus.UNAUTHORIZED, 'Incorrect password');
        }

        if (userDetailsCheck.status === StatusEnum.DELETED) {
            return failureHandler(423, 'User account deleted');
        }
        if (!userDetailsCheck.isVerified) {
            await this.resendOtp(userDetailsCheck.email, LINK);
            return failureHandler(
                HttpStatus.FORBIDDEN,
                'Verify your email through the verification link',
            );
        }

        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            if (userDetailsCheck.status === StatusEnum.INACTIVE) {
                return failureHandler(423, 'User account deactivated');
            }

            //   if (userDetailsCheck.status === StatusEnum.AWAY) {
            //     const inactiveUser = await this.inactiveUserModel
            //       .findById(userDetailsCheck._id)
            //       .session(session);

            //     if (!inactiveUser) {
            //       throw new NotFoundException('Inactive user not found');
            //     }

            //     const {
            //       firstName,
            //       lastName,
            //       address,
            //       postCode,
            //       state,
            //       suburb,
            //       phonenumber,
            //       dateofbirth,
            //       profileImageUrl,
            //       coverImageUrl,
            //       profileSummary,
            //       profileDescription,
            //       facebookUrl,
            //       instagramUrl,
            //       linkedinUrl,
            //       whatsappUrl,
            //       smoker,
            //       preferencelgbtq,
            //       preferencemale,
            //       preferencefemale,
            //       preferencenopet,
            //       preferencenonsmoker,
            //       noPreferences,
            //       personalityPetFriendly,
            //       personalitySmoker,
            //       hobbyCooking,
            //       hobbyMusic,
            //       hobbySports,
            //       rates,
            //       education,
            //       availability,
            //       experience,
            //       workLocation,
            //       ABN,
            //       policeCheck,
            //       infectionControl,
            //       covid,
            //       childrenCheck,
            //       referenceOne,
            //       referenceTwo,
            //       fullName,
            //     } = inactiveUser;

            //     const ProfileData = {
            //       firstName,
            //       lastName,
            //       address,
            //       postCode,
            //       state,
            //       suburb,
            //       phonenumber,
            //       dateofbirth,
            //       profileImageUrl,
            //       coverImageUrl,
            //       profileSummary,
            //       profileDescription,
            //       facebookUrl,
            //       instagramUrl,
            //       linkedinUrl,
            //       whatsappUrl,
            //       smoker,
            //       preferencelgbtq,
            //       preferencemale,
            //       preferencefemale,
            //       preferencenopet,
            //       preferencenonsmoker,
            //       noPreferences,
            //       personalityPetFriendly,
            //       personalitySmoker,
            //       hobbyCooking,
            //       hobbyMusic,
            //       hobbySports,
            //       rates,
            //       education,
            //       availability,
            //       experience,
            //       workLocation,
            //       ABN,
            //       policeCheck,
            //       infectionControl,
            //       covid,
            //       childrenCheck,
            //       referenceOne,
            //       referenceTwo,
            //       fullName,
            //     };

            //     await this.userModel.findByIdAndUpdate(
            //       userDetailsCheck._id,
            //       {$set: ProfileData},
            //       {session},
            //     );

            //     switch (userDetailsCheck.role.toLowerCase()) {
            //       case 'provider':
            //         await this.providerModel.findByIdAndUpdate(
            //           userDetailsCheck._id,
            //           {$set: ProfileData},
            //           {session},
            //         );
            //         break;
            //       case 'participant':
            //         await this.participantModel.findByIdAndUpdate(
            //           userDetailsCheck._id,
            //           {$set: ProfileData},
            //           {session},
            //         );
            //         break;
            //       case 'company':
            //         await this.companyModel.findByIdAndUpdate(
            //           userDetailsCheck._id,
            //           {$set: ProfileData},
            //           {session},
            //         );
            //         break;
            //       default:
            //         throw new BadRequestException('Unsupported role');
            //     }

            //     userDetailsCheck.status = StatusEnum.ACTIVE;
            //     await userDetailsCheck.save({session});

            //     await this.inactiveUserModel.findByIdAndDelete(inactiveUser._id, {
            //       session,
            //     });
            //     await this.commentsModel.updateMany(
            //       {userId: new Types.ObjectId(userDetailsCheck._id), status: AWAY},
            //       {$set: {status: ACTIVE}},
            //       {session},
            //     );

            //     await this.postsModel
            //       .updateMany(
            //         {userId: new Types.ObjectId(userDetailsCheck._id), status: AWAY},
            //         {$set: {status: ACTIVE}},
            //       )
            //       .session(session);
            //     await this.discussionModel
            //       .updateMany(
            //         {userId: new Types.ObjectId(userDetailsCheck._id), status: AWAY},
            //         {$set: {status: APPROVED}},
            //       )
            //       .session(session);
            //   }

            let expiresIn = 24 * 60 * 60;
            if (logindto.keepMeloggedIn) {
                expiresIn = 24 * 60 * 60 * 7;
            }

            if (logindto.fcmToken) {
                await this.userModel.findOneAndUpdate(
                    { email: logindto.email },
                    { $set: { firebasetoken: logindto.fcmToken } },
                    { session },
                );
                expiresIn = 24 * 60 * 60 * 30;
            }

            const token = await this.authService.generateToken({
                userId: userDetailsCheck._id,
                userEmail: userDetailsCheck.email,
                role: userDetailsCheck.role,
                // isMember: userDetailsCheck.freeUser ? false : true,
                expiresIn: expiresIn,
                mobileSession: logindto.fcmToken ? true : false,
            });

            const userDetails = {
                fullName: userDetailsCheck.fullName,
                profileImageUrl: userDetailsCheck.profileImageUrl,
                status: userDetailsCheck.status,
                role: userDetailsCheck.role,
                isVerified: userDetailsCheck.isVerified,
            };

            await session.commitTransaction();
            session.endSession();

            return successHandler('Login success', { token, userDetails });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    // async findEmail(email: string) {
    //     const checkExisting = await this.userModel
    //         .findOne({ email: email })
    //         .select('-password');

    //     if (checkExisting) {
    //         return true;
    //     }
    //     return false;
    // }

    async findOneEmailDetails(email: string) {
        const checkExisting = await this.userModel
            .findOne({ email: email })
            .select('+password');
        if (checkExisting) {
            return checkExisting;
        }
        return null;
    }

    // async login(logindto: LoginDto) {
    //     const userDetailsCheck = await this.findOneEmailDetails(logindto.email);
    //     if (!userDetailsCheck) {
    //         return failureHandler(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
    //     }

    //     // const passwordMatch = await bcrypt.compare(
    //     //     logindto.password,
    //     //     userDetailsCheck.password,
    //     // );
    //     // if (!passwordMatch) {
    //     //     return failureHandler(HttpStatus.UNAUTHORIZED, 'Incorrect password');
    //     // }

    //     // if (userDetailsCheck.status === StatusEnum.DELETED) {
    //     //     return failureHandler(423, 'User account deleted');
    //     // }
    //     // if (!userDetailsCheck.isVerified) {
    //     //     await this.resendOtp(userDetailsCheck.email, LINK);
    //     //     return failureHandler(
    //     //         HttpStatus.FORBIDDEN,
    //     //         'Verify your email through the verification link',
    //     //     );
    //     // }

    //     const session = await this.connection.startSession();
    //     session.startTransaction();

    //     try {
    //         //     if (userDetailsCheck.status === StatusEnum.INACTIVE) {
    //         //         return failureHandler(423, 'User account deactivated');
    //         //     }

    //         //     if (userDetailsCheck.status === StatusEnum.AWAY) {
    //         //         const inactiveUser = await this.inactiveUserModel
    //         //             .findById(userDetailsCheck._id)
    //         //             .session(session);

    //         //         if (!inactiveUser) {
    //         //             throw new NotFoundException('Inactive user not found');
    //         //         }

    //         //         const {
    //         //             firstName,
    //         //             lastName,
    //         //             address,
    //         //             postCode,
    //         //             state,
    //         //             suburb,
    //         //             phonenumber,
    //         //             dateofbirth,
    //         //             profileImageUrl,
    //         //             coverImageUrl,
    //         //             profileSummary,
    //         //             profileDescription,
    //         //             facebookUrl,
    //         //             instagramUrl,
    //         //             linkedinUrl,
    //         //             whatsappUrl,
    //         //             smoker,
    //         //             preferencelgbtq,
    //         //             preferencemale,
    //         //             preferencefemale,
    //         //             preferencenopet,
    //         //             preferencenonsmoker,
    //         //             noPreferences,
    //         //             personalityPetFriendly,
    //         //             personalitySmoker,
    //         //             hobbyCooking,
    //         //             hobbyMusic,
    //         //             hobbySports,
    //         //             rates,
    //         //             education,
    //         //             availability,
    //         //             experience,
    //         //             workLocation,
    //         //             ABN,
    //         //             policeCheck,
    //         //             infectionControl,
    //         //             covid,
    //         //             childrenCheck,
    //         //             referenceOne,
    //         //             referenceTwo,
    //         //             fullName,
    //         //         } = inactiveUser;

    //         //         const ProfileData = {
    //         //             firstName,
    //         //             lastName,
    //         //             address,
    //         //             postCode,
    //         //             state,
    //         //             suburb,
    //         //             phonenumber,
    //         //             dateofbirth,
    //         //             profileImageUrl,
    //         //             coverImageUrl,
    //         //             profileSummary,
    //         //             profileDescription,
    //         //             facebookUrl,
    //         //             instagramUrl,
    //         //             linkedinUrl,
    //         //             whatsappUrl,
    //         //             smoker,
    //         //             preferencelgbtq,
    //         //             preferencemale,
    //         //             preferencefemale,
    //         //             preferencenopet,
    //         //             preferencenonsmoker,
    //         //             noPreferences,
    //         //             personalityPetFriendly,
    //         //             personalitySmoker,
    //         //             hobbyCooking,
    //         //             hobbyMusic,
    //         //             hobbySports,
    //         //             rates,
    //         //             education,
    //         //             availability,
    //         //             experience,
    //         //             workLocation,
    //         //             ABN,
    //         //             policeCheck,
    //         //             infectionControl,
    //         //             covid,
    //         //             childrenCheck,
    //         //             referenceOne,
    //         //             referenceTwo,
    //         //             fullName,
    //         //         };

    //         //         await this.userModel.findByIdAndUpdate(
    //         //             userDetailsCheck._id,
    //         //             { $set: ProfileData },
    //         //             { session },
    //         //         );

    //         //         switch (userDetailsCheck.role.toLowerCase()) {
    //         //             case 'provider':
    //         //                 await this.providerModel.findByIdAndUpdate(
    //         //                     userDetailsCheck._id,
    //         //                     { $set: ProfileData },
    //         //                     { session },
    //         //                 );
    //         //                 break;
    //         //             case 'participant':
    //         //                 await this.participantModel.findByIdAndUpdate(
    //         //                     userDetailsCheck._id,
    //         //                     { $set: ProfileData },
    //         //                     { session },
    //         //                 );
    //         //                 break;
    //         //             case 'company':
    //         //                 await this.companyModel.findByIdAndUpdate(
    //         //                     userDetailsCheck._id,
    //         //                     { $set: ProfileData },
    //         //                     { session },
    //         //                 );
    //         //                 break;
    //         //             default:
    //         //                 throw new BadRequestException('Unsupported role');
    //         //         }

    //         //         userDetailsCheck.status = StatusEnum.ACTIVE;
    //         //         await userDetailsCheck.save({ session });

    //         //         await this.inactiveUserModel.findByIdAndDelete(inactiveUser._id, {
    //         //             session,
    //         //         });
    //         //         await this.commentsModel.updateMany(
    //         //             { userId: new Types.ObjectId(userDetailsCheck._id), status: AWAY },
    //         //             { $set: { status: ACTIVE } },
    //         //             { session },
    //         //         );

    //         //         await this.postsModel
    //         //             .updateMany(
    //         //                 { userId: new Types.ObjectId(userDetailsCheck._id), status: AWAY },
    //         //                 { $set: { status: ACTIVE } },
    //         //             )
    //         //             .session(session);
    //         //         await this.discussionModel
    //         //             .updateMany(
    //         //                 { userId: new Types.ObjectId(userDetailsCheck._id), status: AWAY },
    //         //                 { $set: { status: APPROVED } },
    //         //             )
    //         //             .session(session);
    //         //     }

    //         //     let expiresIn = 24 * 60 * 60;
    //         //     if (logindto.keepMeloggedIn) {
    //         //         expiresIn = 24 * 60 * 60 * 7;
    //         //     }

    //         //     if (logindto.fcmToken) {
    //         //         await this.userModel.findOneAndUpdate(
    //         //             { email: logindto.email },
    //         //             { $set: { firebasetoken: logindto.fcmToken } },
    //         //             { session },
    //         //         );
    //         //         expiresIn = 24 * 60 * 60 * 30;
    //         //     }

    //         //     const token = await this.authService.generateToken({
    //         //         userId: userDetailsCheck._id,
    //         //         userEmail: userDetailsCheck.email,
    //         //         role: userDetailsCheck.role,
    //         //         isMember: userDetailsCheck.freeUser ? false : true,
    //         //         expiresIn: expiresIn,
    //         //         mobileSession: logindto.fcmToken ? true : false,
    //         //     });

    //         //     const userDetails = {
    //         //         fullName: userDetailsCheck.fullName,
    //         //         profileImageUrl: userDetailsCheck.profileImageUrl,
    //         //         coverImageUrl: userDetailsCheck.coverImageUrl,
    //         //         status: userDetailsCheck.status,
    //         //         roleCategory: userDetailsCheck.roleCategory,
    //         //         isVerified: userDetailsCheck.isVerified,
    //         //         totalRatings: userDetailsCheck.totalRatings,
    //         //         totalReviews: userDetailsCheck.totalReviews,
    //         //     };

    //         await session.commitTransaction();
    //         session.endSession();

    //         return successHandler('Login success', {});
    //     } catch (error) {
    //         await session.abortTransaction();
    //         session.endSession();
    //         throw error;
    //     }
    // }

    async findById(id: string) {
        return this.userModel.findById(id).exec();
    }

    async findOneEmail(email: string) {
        const checkExisting = await this.userModel
            .findOne({ email: email })
            .select('-password');
        if (checkExisting) {
            return checkExisting;
        }
        return null;
    }



    async findSubAndUpdate(email: string) {
        const checkExisting = await this.userModel
            .findOne({ email: email })
            .select('+password');
        if (checkExisting) {
            return checkExisting;
        }
        return null;
    }

    async findEmail(email: string) {
        const checkExisting = await this.userModel
            .findOne({ email: email })
            .select('-password');

        if (checkExisting) {
            return true;
        }


        return false;
    }

    async resendOtp(email: string, type: string) {
        const userDetails = await this.userModel.findOne({ email: email });
        if (!userDetails) {
            throw new Error('User not found'); // Or handle error appropriately
        }
        const otpData = await this.otpService.setOtp(userDetails._id);

        if (type === LINK) {
            const token = this.jwtService.sign(
                { userId: otpData.userId, otp: otpData.otp },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '1h',
                },
            );

            const verificationLink = `${process.env.BACKEND_URL}api/user/verifyLink?token=${token}`;
            await this.mailService.sendEmail(
                email,
                emailSub.sendVerificationLink,
                emailTemplates.sendVerificationLink,
                {
                    firstName: capitalizeFirstLetter(userDetails.firstName),
                    verificationLink,
                },
            );
            return successHandler('success');
        }

        if (type === RESET) {
            await this.mailService.sendEmail(
                email,
                emailSub.resetPassword,
                emailTemplates.resetPassword,
                {
                    firstName: capitalizeFirstLetter(userDetails.firstName),
                    otpToken: otpData.otp,
                },
            );
            return successHandler('success');
        }
    }


    async updateStatus(userId: string, dto: UpdateUserStatusDto) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            {
                $set: { status: dto.status },
            },
            { new: true }
        ).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Add any additional logic here (e.g., send email notification)
        return successHandler('User approved sucessfully');
    }

    // async resetPassword(_resetPasswordDto: ResetPasswordDto) {
    //     const userDetails = await this.findOneEmail(_resetPasswordDto.email);
    //     if (!userDetails) {
    //         throw new NotFoundException('email not found');
    //     }

    //     const isOtpValid = await this.otpService.verifyOtp(
    //         new Types.ObjectId(userDetails._id),
    //         _resetPasswordDto.otp,
    //     );
    //     if (!isOtpValid) {
    //         return failureHandler(HttpStatus.BAD_REQUEST, 'Invalid OTP');
    //     }

    //     userDetails.password = _resetPasswordDto.newPassword;
    //     await userDetails.save();
    //     return successHandler('Password reset successful');
    // }

    // async resetPassword(_resetPasswordDto: ResetPasswordDto) {
    //   const userDetails = await this.findOneEmailDetails(_resetPasswordDto.email);
    //   if (!userDetails) {
    //     throw new NotFoundException('Email not found');
    //   }

    //   const isOtpValid = await this.otpService.verifyOtp(
    //     new Types.ObjectId(userDetails._id),
    //     _resetPasswordDto.otp,
    //   );
    //   if (!isOtpValid) {
    //     return failureHandler(HttpStatus.BAD_REQUEST, 'Invalid OTP');
    //   }

    //   if (!userDetails.password) {
    //     throw new Error('User password is missing in the database.');
    //   }

    //   const isSamePassword = await bcrypt.compare(
    //     _resetPasswordDto.newPassword,
    //     userDetails.password,
    //   );
    //   if (isSamePassword) {
    //     return failureHandler(
    //       HttpStatus.BAD_REQUEST,
    //       'New password cannot be the same as the previous password',
    //     );
    //   }

    //   userDetails.password = await bcrypt.hash(_resetPasswordDto.newPassword, 10);
    //   await userDetails.save();

    //   return successHandler('Password reset successful');
    // }

    // async updateEmail(userId: string, currentEmail: string, newEmail: string) {
    //     const user = await this.userModel.findOne({
    //         _id: new Types.ObjectId(userId),
    //         email: currentEmail,
    //     });

    //     if (!user) {
    //         return failureHandler(404, USER_NOT_FOUND);
    //     }

    //     if (user.email === newEmail) {
    //         return failureHandler(400, 'new email cannot be the same');
    //     }

    //     const emailCheck = await this.findEmail(newEmail);
    //     if (emailCheck) {
    //         return failureHandler(HttpStatus.CONFLICT, 'email already exists');
    //     }

    //     const existingCustomers = await this.stripe.customers.list({
    //         email: newEmail,
    //     });
    //     if (existingCustomers.data.length) {
    //         return failureHandler(HttpStatus.CONFLICT, 'email already exists');
    //     }

    //     const previousDetails = await this.stripe.customers.list({
    //         email: currentEmail,
    //     });
    //     if (previousDetails.data.length) {
    //         await this.stripe.customers.update(previousDetails.data[0].id, {
    //             email: newEmail,
    //         });
    //     }

    //     const otpData = await this.otpService.setOtp(user._id);
    //     const token = this.jwtService.sign(
    //         { userId: otpData.userId, otp: otpData.otp },
    //         {
    //             secret: process.env.JWT_SECRET,
    //             expiresIn: '1h',
    //         },
    //     );

    //     const verificationLink = `${process.env.BACKEND_URL}api/user/verifyLink?token=${token}`;
    //     await this.mailService.sendEmail(
    //         newEmail,
    //         emailSub.updateEmail,
    //         emailTemplates.updateEmail,
    //         { firstName: capitalizeFirstLetter(user.firstName), verificationLink },
    //     );

    //     user.email = newEmail;
    //     user.isVerified = false;
    //     await user.save();

    //     return successHandler('Email Updated Successfully');
    // }

    async updatePassword(
        userId: string,
        oldPassword: string,
        newPassword: string,
    ) {
        const user = await this.userModel
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

    async getAllUsers(
        role?: string,
        roleCategory?: string,
        name?: string,
        member?: boolean,
        page?: number,
        limit?: number,
    ) {
        const { currentPage, pageSize, skip } = paginationParams(page, limit);
        const matchConditions: any = { isVerified: true };

        // const isAdmin = ADMIN_ROLES.includes(user.role) ? true : false;

        await this.userModel.updateMany(
            { status: ACTIVE, roleCategory: roleCategory },
            { $set: { adminNotified: true } },
        );

        // if(roleCategory === 'company'){
        //   await this.userModel.updateMany(
        //     {status: ACTIVE},
        //     {$set: {adminNotified: true}},
        //   );
        // }

        if (role) matchConditions.role = role;
        if (roleCategory) matchConditions.roleCategory = roleCategory;
        if (member !== undefined) matchConditions.freeUser = !member;

        if (name) {
            matchConditions.fullName = { $regex: name, $options: 'i' };
        }

        const pipeline: any[] = [
            { $match: matchConditions },
            {
                $facet: {
                    documents: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: Number(pageSize) },
                        {
                            $project: {
                                _id: 1,
                                fullName: 1,
                                profileImageUrl: 1,
                                email: 1,
                                role: 1,
                                freeUser: 1,
                                isFounder: 1,
                                status: 1,
                                profileVerified: 1,
                                createdAt: 1,
                                roleCategory: 1,
                            },
                        },
                    ],
                    totalCount: [{ $count: 'value' }],
                },
            },
        ];

        const [result] = await this.userModel.aggregate(pipeline).exec();

        const { documents, totalCount } = result;
        const totalItems = getDocumentTotal(totalCount);
        const paginated = Pagination({
            totalItems,
            page: currentPage,
            limit: pageSize,
        });

        return { documents, paginated };
    }

    // async updateProfileStatus(
    //     id: string,
    //     newStatus: string,
    // ): Promise<User | null> {
    //     const existingStatus = await this.userModel.findById(id);
    //     if (existingStatus.status == AWAY) {
    //         return existingStatus;
    //     }

    //     const updatedUser = await this.userModel
    //         .findByIdAndUpdate(
    //             id,
    //             { $set: { status: newStatus } },
    //             { new: true, runValidators: true },
    //         )
    //         .exec();

    //     return updatedUser;
    // }
    async updateProfileStatus(id: string, newStatus: string): Promise<User | null> {
        const existingStatus = await this.userModel.findById(id);

        // ✅ Check if user exists before accessing status
        if (!existingStatus) {
            return null; // or throw an error if needed
        }

        if (existingStatus.status === AWAY) {
            return existingStatus;
        }

        const updatedUser = await this.userModel
            .findByIdAndUpdate(
                id,
                { $set: { status: newStatus } },
                { new: true, runValidators: true },
            )
            .exec();

        return updatedUser;
    }


    async profileVerificationStatus(
        id: string,
        newStatus: boolean,
    ): Promise<User | null> {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(
                id,
                { $set: { profileVerified: newStatus } },
                { new: true, runValidators: true },
            )
            .exec();
        return updatedUser;
    }

    async uploadImage(
        imagePath: string,
        userId: Types.ObjectId | string,
        field: string,
        activityLog: string,
    ) {
        await this.userModel
            .findByIdAndUpdate(userId, { $set: { [field]: imagePath } }, { new: true })
            .lean();

        return successHandler('image updated successfully', { [field]: imagePath });
    }

    async getAllUsersAdmin(
        status?: string,
        page?: number,
        limit?: number,
        search?: string,
        type?:string
    ) {
        try {
            const { currentPage, pageSize, skip } = paginationParams(page, limit);
            const matchConditions: any = {
                isVerified: true
            };
            console.log(status)
            if (status) {
                matchConditions.status = status;
            }
            if (type) {
                matchConditions.role = type;
            }
            if (search) {
                matchConditions.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                ];
            }

            const pipeline: any[] = [
                {
                    $match: matchConditions
                },
                {
                    $lookup: {
                        from: "departments",
                        localField: "department",
                        foreignField: "_id",
                        as: "departmentDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$departmentDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $facet: {
                        documents: [{ $skip: skip }, { $limit: Number(pageSize) }],
                        totalCount: [{ $count: 'value' }],
                    },
                },
            ];
            const [result] = await this.userModel.aggregate(pipeline).exec();
            const { documents, totalCount } = result;
            const totalItems = getDocumentTotal(totalCount);
            const paginated = Pagination({
                totalItems,
                page: currentPage,
                limit: pageSize,
            });

            return successHandler('success', { documents, paginated });
        } catch (error) {
            throw error
        }
    }

    // async profileCompletion(userId: string, role: string) {
    //   const collections = {
    //     [PROVIDER]: this.providerModel,
    //     [PARTICIPANT]: this.participantModel,
    //     [COMPANY]: this.companyModel,
    //   };
    //   let completedFields = 0;
    //   let totalRequiredFields = 18;

    //   const userDetails = await this.findById(userId);

    //   const requiredFields = [
    //     'email',
    //     'firstName',
    //     'lastName', //3
    //     'address',
    //     'postCode',
    //     'state', //6
    //     'suburb',
    //     'gender',
    //     'dateofbirth', //9
    //     'profileDescription',
    //     'profileSummary', //12
    //     'phonenumber',
    //     'linkedinUrl',
    //     'instagramUrl',
    //     'facebookUrl', //15
    //     'whatsappUrl',
    //   ];

    //   requiredFields.forEach((field) => {
    //     if (userDetails[field] && userDetails[field] !== '') {
    //       completedFields++;
    //     }
    //   });

    //   if (userDetails['profileImageUrl'] !== DEFAULT_PROFILE_IMAGE_PATH) {
    //     completedFields++;
    //   } //17
    //   if (userDetails['coverImageUrl'] !== DEFAULT_COVER_IMAGE_PATH) {
    //     completedFields++;
    //   } //18

    //   const specificDetails = await collections[role].findById(userId);

    //   if (role === PROVIDER) {
    //     totalRequiredFields += 5;

    //     if (
    //       specificDetails['education'] &&
    //       specificDetails['education'].length !== 0
    //     ) {
    //       completedFields++;
    //     }
    //     if (
    //       specificDetails['workLocation'] &&
    //       specificDetails['workLocation'].length !== 0
    //     ) {
    //       completedFields++;
    //     }
    //     if (
    //       specificDetails['experience'] &&
    //       specificDetails['experience'].length !== 0
    //     ) {
    //       completedFields++;
    //     }
    //     if (specificDetails['rates']) {
    //       for (const day of ['weekday', 'saturday', 'sunday']) {
    //         //23
    //         if (specificDetails['rates'][day] !== null) {
    //           completedFields++;
    //           break;
    //         }
    //       }
    //     }
    //     if (specificDetails['availability']) {
    //       for (const day of [
    //         'monday',
    //         'tuesday',
    //         'wednesday',
    //         'thursday',
    //         'friday',
    //         'saturday',
    //         'sunday',
    //       ]) {
    //         //24
    //         if (specificDetails['availability'][day].length !== 0) {
    //           completedFields++;
    //           break;
    //         }
    //       }
    //     }
    //   } else if (role == COMPANY) {
    //     totalRequiredFields += 8
    //     let companyFeild = ["companySize", "founded", "headQuaters", "phone", "website"]

    //     companyFeild.forEach((field) => {
    //       if (specificDetails[field] && specificDetails[field] !== '') {
    //         completedFields++;
    //       }
    //     });

    //     if (specificDetails['workLocation'] && specificDetails['workLocation'].length !== 0) {
    //       completedFields++;
    //     }
    //     if (specificDetails['availability']) {
    //       for (const day of [
    //         'monday',
    //         'tuesday',
    //         'wednesday',
    //         'thursday',
    //         'friday',
    //         'saturday',
    //         'sunday',
    //       ]) {
    //         //24
    //         if (specificDetails['availability'][day].length !== 0) {
    //           completedFields++;
    //           break;
    //         }
    //       }
    //     }

    //     if (specificDetails['rates']) {
    //       for (const day of ['weekday', 'saturday', 'sunday']) {
    //         //23
    //         if (specificDetails['rates'][day] !== null) {
    //           completedFields++;
    //           break;
    //         }
    //       }
    //     }
    //   }

    //   let percentage: number = (completedFields / totalRequiredFields) * 100;
    //   percentage = Number(percentage.toFixed(2));

    //   return successHandler('success', { percentage });
    // }


    async updateSinglefield(
        userId: string,
        newFieldValue: string,
        fieldName: string,
        activityLog: string,
    ) {
        await this.userModel
            .findByIdAndUpdate(
                userId,
                { $set: { [fieldName]: newFieldValue } },
                { new: true },
            )
            .lean();

        return successHandler('Updated Successfully', { [fieldName]: newFieldValue });
    }



    async chatProfile(userId: Types.ObjectId | string) {
        if (!Types.ObjectId.isValid(userId)) {
            return failureHandler(400, 'Invalid user ID');
        }
        const userDetails = await this.userModel
            .findById(userId)
            .select('firstName lastName statusOnline profileImageUrl');
        return userDetails;
    }



    // async getAllProvidersGraph(
    //   state?: string,
    //   groupBy?: string,
    // ): Promise<{ documents: User[]; totalUsers: number; groupBy: string }> {
    //   const matchConditions: any = {};

    //   if (state) {
    //     matchConditions.state = { $regex: state, $options: 'i' };
    //   }

    //   const now = new Date();
    //   let startOfPeriod: Date;
    //   let endOfPeriod: Date;

    //   switch (groupBy) {
    //     case 'month':
    //       startOfPeriod = new Date(now.getFullYear(), now.getMonth(), 1);
    //       endOfPeriod = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    //       break;
    //     case 'week':
    //       startOfPeriod = new Date(now.setDate(now.getDate() - now.getDay()));
    //       endOfPeriod = new Date(now.setDate(now.getDate() + 6));
    //       break;
    //     default:
    //       startOfPeriod = new Date(now.getFullYear(), 0, 1);
    //       endOfPeriod = new Date(now.getFullYear() + 1, 0, 1);
    //   }

    //   matchConditions.createdAt = { $gte: startOfPeriod, $lt: endOfPeriod };

    //   const pipeline: any[] = [
    //     { $match: { role: PROVIDER, isVerified: true, status: ACTIVE } },
    //     {
    //       $facet: {
    //         totalCount: [{ $count: 'value' }],
    //         documents: [
    //           {
    //             $match: {
    //               createdAt: { $gte: startOfPeriod, $lt: endOfPeriod },
    //               isVerified: true,
    //               ...matchConditions,
    //             },
    //           },
    //           {
    //             $group: {
    //               _id: '$roleCategory',
    //               roleCount: {
    //                 $sum: 1,
    //               },
    //             },
    //           },
    //         ],
    //       },
    //     },
    //   ];

    //   const [result] = await this.userModel.aggregate(pipeline).exec();

    //   const { documents, totalCount } = result;
    //   const totalUsers = getDocumentTotal(totalCount);

    //   return { documents, totalUsers, groupBy };
    // }

    async getAllProvidersGraph(
        state?: string,
        role?: string,
    ): Promise<{ documents: User[]; totalUsers: number }> {
        const matchConditions: any = { isVerified: true, status: 'active' };

        if (state) {
            matchConditions.state = { $regex: state, $options: 'i' };
        }

        if (role) {
            matchConditions.role = role; // Filter by role (e.g., 'participant' or 'provider')
        }

        const now = new Date();
        const startOfPeriod = new Date(now.getFullYear(), 0, 1); // Start of the year
        const endOfPeriod = new Date(now.getFullYear() + 1, 0, 1); // End of the year

        matchConditions.createdAt = { $gte: startOfPeriod, $lt: endOfPeriod };

        const pipeline: any[] = [
            {
                $facet: {
                    totalCount: [{ $match: matchConditions }, { $count: 'value' }],
                    documents: [
                        {
                            $match: matchConditions,
                        },
                        {
                            $group: {
                                _id: '$roleCategory',
                                roleCount: {
                                    $sum: 1,
                                },
                            },
                        },
                    ],
                },
            },
        ];

        const [result] = await this.userModel.aggregate(pipeline).exec();

        const { documents, totalCount } = result;
        const totalUsers = totalCount.length > 0 ? totalCount[0].value : 0;

        return { documents, totalUsers };
    }

    async updateUserStatus(
        userId?: string,
        newStatus?: boolean,
    ) {
        return await this.userModel.findByIdAndUpdate(userId, {
            $set: { statusOnline: newStatus },
        });
    }




}
