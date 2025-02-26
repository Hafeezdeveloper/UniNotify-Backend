// src/socket/socket.gateway.ts
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { SessionService } from './session.service';
import { SOCKET_EVENTS } from 'src/lib/constants/app.constants';
import { Types } from 'mongoose';
import { ChatService } from 'src/chat/chat.service';
import { logger } from 'src/lib/helpers/utility.logger';
import * as dotenv from 'dotenv';
// src/socket/socket.types.ts
dotenv.config();

export interface SocketWithAuth extends Socket {
  userId: string;
  userEmail: string;
  token: string;
}

@WebSocketGateway({
  cors: { origin: '*' },
  pingInterval: 5000,
  pingTimeout: 10000,
})
@Injectable()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  private rooms: Map<string, string> = new Map(); // appointmentId -> roomId mapping

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly sessionService: SessionService,
  ) { }

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
    this.setupMiddleware(server);
  }

  private setupMiddleware(server: Server) {
    server.use((socket, next) => {
      const token = socket.handshake.auth?.token;
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET || "Secret@123", async (err, decoded: any) => {
          if (err) {
            return next(new Error('Authentication error'));
          }

          // Explicitly cast the socket as SocketWithAuth
          const authSocket = socket as SocketWithAuth;

          authSocket.token = token;
          authSocket.userEmail = decoded.userEmail;
          authSocket.userId = decoded.userId;

          // Update user status online
          await this.userService.updateUserStatus(authSocket.userId, true);
          await this.sessionService.updateSession(authSocket.token, authSocket.id);

          next();
        });
      } else {
        next(new Error('Authentication error'));
      }
    });
  }


  handleConnection(client: SocketWithAuth) {
    this.logger.log(`Client connected: ${client.userId}`);
    this.server.emit(SOCKET_EVENTS.USER_STATUS, {
      userId: client.userId,
      statusOnline: true,
    });
    // this.startPing(client);
  }

  async handleDisconnect(client: SocketWithAuth) {
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.userService.updateUserStatus(client.userId, false);
    this.server.emit(SOCKET_EVENTS.USER_STATUS, {
      userId: client.userId,
      statusOnline: false,
    });
  }

  @SubscribeMessage('ping')
  handlePong(client: Socket) { }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE_RECEIVED)
  async handleMessageReceived(client: SocketWithAuth, data: { receiverId: string }) {
    try {
      await this.chatService.markAsRead(
        client.userId.toString(),
        data.receiverId,
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }
  // startPing(client: Socket) {
  //     const interval = setInterval(() => {
  //         if (client.connected) {
  //             console.log('sending ping to client', client.id)
  //             client.emit('ping');
  //         } else {
  //             clearInterval(interval);
  //         }
  //     }, 10000); // Send ping every 30 seconds

  //     // Optionally, stop pinging if the client disconnects
  //     client.on('disconnect', () => {
  //         clearInterval(interval);
  //     });
  // }
  private emitSocket(socketId: string, eventName: string, data: any) {
    if (this.server) {
      this.server.to(socketId).emit(eventName, data);
    } else {
      this.logger.error('Socket server is not initialized.');
    }
  }

  private emitGlobalSocket(eventName: string, data: any) {
    if (this.server) {
      this.server.emit(eventName, data);
    } else {
      this.logger.error('Socket server is not initialized.');
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    console.log(`Client `);
    console.log(`Client ${client.id} joined room ${roomId}`);

    client.to(roomId).emit('userJoined', client.id); // Notify others in the room
  }

  @SubscribeMessage('signal')
  async handleSignal(
    client: Socket,
    payload: { roomId: string; signalData: any; userId: string },
  ) {
    const { roomId, signalData } = payload;
    console.log(`Signal from ${client.id} to room ${roomId}:`, signalData);
    client.to(roomId).emit('signal', { signal: signalData, userId: client.id });
  }

  @SubscribeMessage('iceCandidate')
  async handleIceCandidate(
    client: Socket,
    payload: { roomId: string; candidate: any },
  ) {
    const { roomId, candidate } = payload;
    console.log(
      `ICE Candidate from ${client.id} to room ${roomId}:`,
      candidate,
    );

    client.to(roomId).emit('iceCandidate', { candidate });
  }

  public async callEvents(
    userId: Types.ObjectId | string,
    event: SOCKET_EVENTS,
    data: {
      roomId: string;
      userId: Types.ObjectId;
      firstName: string;
      lastName: string;
      profileImageUrl: string;
    },
  ) {
    try {
      const userSessions = await this.sessionService.findAllSessions(userId);

      // Iterate through user sessions and emit event
      for (const { socketId } of userSessions) {
        this.emitSocket(socketId, event, data);

        // Store the roomId in this.rooms map (use userId or another key if needed)
        if (data.roomId) {
          this.rooms.set(data.roomId, userId.toString()); // Store roomId and userId or another identifier
          this.logger.log(`Room ${data.roomId} stored for user ${userId}`);
          console.log(`Room ${data.roomId} stored for user ${userId}`);
        }
      }

      return true;
    } catch (error) {
      logger.error(`Error in callEvent: ${error.message}`);
      return false;
    }
  }

  public async customEvents(
    userId: Types.ObjectId | string,
    event: SOCKET_EVENTS,
    data: any,
  ) {
    try {
      const userSessions = await this.sessionService.findAllSessions(userId);
      for (const { socketId } of userSessions) {
        this.emitSocket(socketId, event, data);
      }
      return true;
    } catch (error) {
      logger.error(error);
      return true;
    }
  }


  public async adminDashboard(event: SOCKET_EVENTS, data: any) {
    try {
      this.emitGlobalSocket(event, data);
      return true;
    } catch (error) {
      logger.error(error);
      return true;
    }
  }
}
