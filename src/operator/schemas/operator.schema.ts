import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {IsLowercase} from 'class-validator';
import {Exclude} from 'class-transformer';
import * as bcrypt from 'bcrypt';
import {StatusEnum} from '../../lib/constants/app.constants';

export type OperatorDocument = HydratedDocument<Operator>;

@Schema({timestamps: true})
export class Operator {
  @Prop({required: true})
  firstName: string;

  @Prop({required: true})
  lastName: string;

  @Prop({required: true})
  userName: string;

  @Prop({})
  fullName: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true, select: false})
  @Exclude()
  password: string;

  @Prop({maxlength: 10})
  phonenumber: string;

  @IsLowercase()
  @Prop({required: true})
  adminType: string;

  @Prop({default: false})
  isSuperAdmin: boolean;

  @Prop({required: true, enum: StatusEnum, default: StatusEnum.ACTIVE})
  status: string;

  @Prop({type: Boolean, default: false})
  module1read: boolean;

  @Prop({type: Boolean, default: false})
  module1write: boolean;

  @Prop({type: Boolean, default: false})
  module2read: boolean;

  @Prop({type: Boolean, default: false})
  module2write: boolean;

  @Prop({type: Boolean, default: false})
  module3read: boolean;

  @Prop({type: Boolean, default: false})
  module3write: boolean;

  @Prop({type: Boolean, default: false})
  module4read: boolean;

  @Prop({type: Boolean, default: false})
  module4write: boolean;
}

export const OperatorSchema = SchemaFactory.createForClass(Operator);

OperatorSchema.pre<OperatorDocument>('save', async function (next) {
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
OperatorSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as OperatorDocument;
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
