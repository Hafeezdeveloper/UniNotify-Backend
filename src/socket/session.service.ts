//src/socket/socket/session.service.ts
import { Injectable } from '@nestjs/common';
import { Session, SessionDocument } from './schemas/session.schema'; // Replace with actual Session model import
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async updateSession(token: string, socketId: string): Promise<void> {
    await this.sessionModel.findOneAndUpdate({ token }, { socketId });
  }

  async sessionLogout(sessionId: Types.ObjectId): Promise<boolean> {
    const loggedOut = await this.sessionModel.findByIdAndUpdate(sessionId, {
      status: false,
    }, { new: true }); // Ensure it returns the updated document

    if (!loggedOut) {
      return false; // If session was not found, return false
    }

    // Proceed only if loggedOut exists
    await this.userModel.findByIdAndUpdate(loggedOut.userId, {
      $set: { firebasetoken: null },
    });

    return true;
  }


  async clearAllSession(userId: string) {
    await this.sessionModel.updateMany(
      {
        userId: new Types.ObjectId(userId),
        status: true,
      },
      { $set: { status: false } },
    );
  }

  async findAllSessions(userId: Types.ObjectId | string) {
    return await this.sessionModel
      .find({ userId: new Types.ObjectId(userId), status: true })
      .select('socketId');
  }
}
