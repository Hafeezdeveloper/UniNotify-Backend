//src/socket/socket/socket.service.ts
import {Injectable} from '@nestjs/common';
import {Server} from 'socket.io';
import {Session, SessionDocument} from './schemas/session.schema';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class SocketService {
  private server: Server;
  constructor(
    @InjectModel(Session.name)
    private readonly sessionsModel: Model<SessionDocument>,
  ) {}

  setSocketServer(server: Server) {
    this.server = server;
  }
  socketEventEmitter(socketId: string, event: string, data: any) {
    if (this.server) {
      this.server.to(socketId).emit(event, data);
    }
  }
}
