import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { genderEnum, roleEnum, UserStatusEnum } from 'src/libaray/constants/app.constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({})
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({})
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, })
  password: string;

  @Prop({ enum: roleEnum })
  role: string;

  @Prop({  default: UserStatusEnum.PENDING })
  status: string;

  @Prop({ required: true, default: false })
  isVerified: boolean;

  @Prop({ default: false })
  statusOnline: boolean;


  @Prop()
  dateofbirth: Date;

  @Prop({ enum: genderEnum })
  gender: string;

  @Prop({})
  firebasetoken: string;



  //   @Prop({default: DEFAULT_PROFILE_IMAGE_PATH})
  //   profileImageUrl: string;

  //   @Prop({default: DEFAULT_COVER_IMAGE_PATH})
  //   coverImageUrl: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

// // Pre hook for save
// UserSchema.pre<UserDocument>('save', async function (next) {
//   if (
//     !this.isModified('password') &&
//     (!this.isModified('firstName') || !this.isModified('lastName'))
//   ) {
//     return next();
//   }

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,20}$/;
//   if (!passwordRegex.test(this.password)) {
//     const error = new Error(
//       'Password must contain one lowercase letter, one uppercase letter, one numeric character, and one special character.',
//     );
//     return next(error);
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashedPassword;

//     if (this.firstName && this.lastName) {
//       this.fullName = `${this.firstName} ${this.lastName}`;
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Pre hook for findOneAndUpdate
// UserSchema.pre('findOneAndUpdate', async function (next) {
//   const update = this.getUpdate() as UserDocument;
//   if (update.password) {
//     const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,20}$/;
//     if (!passwordRegex.test(update.password)) {
//       const error = new Error(
//         'Password must contain one lowercase letter, one uppercase letter, one numeric character, and one special character.',
//       );
//       return next(error);
//     }

//     try {
//       const hashedPassword = await bcrypt.hash(update.password, 10);
//       update.password = hashedPassword;
//       this.setUpdate(update);
//       next();
//     } catch (error) {
//       next(error);
//     }
//   }
//   if (update.firstName || update.lastName) {
//     update.fullName = `${update.firstName} ${update.lastName}`;
//     this.setUpdate(update);
//     next();
//   }
//   next();
// });

// Pre hook for save
UserSchema.pre<UserDocument>('save', async function (next) {
  if (
    !this.isModified('password') &&
    (!this.isModified('firstName') || !this.isModified('lastName'))
  ) {
    return next();
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,20}$/;
  if (!passwordRegex.test(this.password)) {
    const error = new Error(
      'Password must contain one lowercase letter, one uppercase letter, one numeric character, and one special character.',
    );
    return next(error);
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    this.fullName = `${this.firstName} ${this.lastName}`;
    next();
  } catch (error) {
    next(error);
  }
});
// Pre hook for findOneAndUpdate

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as UserDocument;
  if (update.password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,20}$/;
    if (!passwordRegex.test(update.password)) {
      const error = new Error(
        'Password must contain one lowercase letter, one uppercase letter, one numeric character, and one special character.',
      );
      return next(error);
    }
    try {
      const hashedPassword = await bcrypt.hash(update.password, 10);
      update.password = hashedPassword;
      this.setUpdate(update);
      next();
    } catch (error) {
      next(error);
    }
  }
  if (update.firstName || update.lastName) {
    update.fullName = `${update.firstName} ${update.lastName}`;
    this.setUpdate(update);
    next();
  }
  next();
});
