import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model, Types} from 'mongoose';
import {
  MAX_ACTIVE_SESSIONS,
  MAX_MOBILE_SESSIONS,
} from 'src/lib/constants/app.constants';

export type SessionDocument = HydratedDocument<Session>;

@Schema({timestamps: true})
export class Session {
  @Prop({required: true, Ref: 'User'})
  userId: Types.ObjectId;

  @Prop({required: true})
  expiry: number;

  @Prop({})
  socketId: string;

  @Prop({})
  mobileSession: boolean;

  @Prop({default: true})
  status: boolean;

  @Prop({})
  token: string;

  @Prop({default: Date.now})
  createdAt: Date;
}
export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.pre<SessionDocument>('save', async function (next) {
  const SessionModel = this.constructor as unknown as Model<SessionDocument>;

  try {
    if (this.mobileSession) {
      await handleSessionLimit(
        SessionModel,
        this.userId,
        true,
        MAX_MOBILE_SESSIONS,
      );
    } else {
      await handleSessionLimit(
        SessionModel,
        this.userId,
        false,
        MAX_ACTIVE_SESSIONS,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

async function handleSessionLimit(
  SessionModel: Model<SessionDocument>,
  userId: Types.ObjectId,
  sessionTypeCondition: boolean,
  maxSessions: number,
) {
  const latestSessions = await SessionModel.find({
    userId: new Types.ObjectId(userId),
    status: true,
    mobileSession: sessionTypeCondition,
  })
    .sort({createdAt: -1})
    .limit(maxSessions)
    .select('_id');

  const latestSessionIds = latestSessions.map((session) => session._id);

  await SessionModel.updateMany(
    {
      userId: new Types.ObjectId(userId),
      status: true,
      mobileSession: sessionTypeCondition,
      _id: {$nin: latestSessionIds},
    },
    {$set: {status: false}},
  );
}
