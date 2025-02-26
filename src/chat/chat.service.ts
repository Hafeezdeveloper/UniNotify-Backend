import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import mongoose, { Model, Types } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { LastMessage, LastMessageDocument } from './schemas/last-message.schema';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';

import {
  capitalizeFirstLetter,
  failureHandler,
  generateNineDigitOTP,
  getDocumentTotal,
  getNode,
  Pagination,
  paginationParams,
  successHandler,
} from 'src/lib/helpers/utility.helpers';
import { SocketGateway } from 'src/socket/socket.gateway';
import {
  ACTIVITY_CATEGORIES,
  ALL,
  LAST_MESSAGE_TIME,
  MY,
  NOTIFICATION_ROUTING_ENUM,
  NOTIFICATION_TYPE_ENUM,
  SOCKET_EVENTS,
} from 'src/lib/constants/app.constants';
import { IUser } from 'src/lib/constants/interfaces';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PaginatedOutput } from 'src/lib/dto/pagination.dto';
import { SessionService } from 'src/socket/session.service';
import { User, UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Conversation.name)
    private ConversationModel: Model<ConversationDocument>,
    @InjectModel(LastMessage.name)
    private lastMessageModel: Model<LastMessageDocument>,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
    private readonly notificationService: NotificationsService,
    private readonly sessionService: SessionService,
    @Inject(forwardRef(() => SocketGateway))
    private readonly socketGateway: SocketGateway,
  ) { }

  async sendNewMessage(user: IUser, createChatDto: CreateChatDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const senderId = user._id;
      const uuid = getNode(
        senderId,
        new Types.ObjectId(createChatDto.receiverId),
      );

      // const isBlocked = await this.blockModel.findOne({uuid: uuid});

      // if (isBlocked) {
      //   return failureHandler(400, 'Cannot send message');
      // }

      let NotifyUser = false;
      const ReceiverDetails = await this.userModel.findById(
        createChatDto.receiverId,
      );
      let doesChatExists = await this.ConversationModel.findOne({ uuid: uuid });

      if (!doesChatExists) {
        const newConv = new this.ConversationModel({
          members: [senderId, new Types.ObjectId(createChatDto.receiverId)],
          uuid: uuid,
        });

        doesChatExists = await newConv.save({ session });
        NotifyUser = true;

        // await this.activityLogService.activityLogger(
        //   senderId.toString(),
        //   null,
        //   ACTIVITY_CATEGORIES.MESSAGES,
        //   `Initiated a new chat with ${capitalizeFirstLetter(ReceiverDetails.firstName)} ${capitalizeFirstLetter(ReceiverDetails.lastName)}`,
        //   session,
        // );
        await this.socketGateway.customEvents(
          new Types.ObjectId(createChatDto.receiverId),
          SOCKET_EVENTS.NEW_CONVERSATION,
          {},
        );
      }

      for (const allUser of doesChatExists.members) {
        const updateLastMessage = await this.lastMessageModel
          .findOneAndUpdate(
            { userId: new Types.ObjectId(allUser), uuid: uuid },
            {
              lastMessage: createChatDto.messageBody,
              lastMessageSendBy: senderId,
              lastMessageTime: Date.now(),
              lastMessageType: 'text',
            },
          )
          .session(session);
        if (!updateLastMessage) {
          const lastChat = new this.lastMessageModel({
            uuid: uuid,
            userId: new Types.ObjectId(allUser),
            lastMessage: createChatDto.messageBody,
            lastMessageTime: new Date(),
            lastMessageType: 'text',
            lastMessageSendBy: new Types.ObjectId(senderId),
          });
          await lastChat.save();
          NotifyUser = true;
        }
        if (updateLastMessage && updateLastMessage.lastMessageTime) {
          const timePassedSinceLastMessage = new Date(
            updateLastMessage.lastMessageTime.getTime() + LAST_MESSAGE_TIME,
          );

          if (timePassedSinceLastMessage < new Date()) {
            NotifyUser = true;
          }
        }
      }

      const newMessage = new this.MessageModel({
        uuid: uuid,
        senderId: senderId,
        userId: senderId,
        messageBody: createChatDto.messageBody,
        isRead: true,
        type: 'text',
      });

      const receiverMessage = new this.MessageModel({
        uuid: uuid,
        senderId: senderId,
        userId: new Types.ObjectId(createChatDto.receiverId),
        messageBody: createChatDto.messageBody,
        isRead: false,
        type: 'text',
      });

      await receiverMessage.save({ session });
      await newMessage.save({ session });

      if (NotifyUser) {
        await this.notificationService.createNotification({
          userId: new Types.ObjectId(createChatDto.receiverId),
          title: 'New message',
          icon: user.profileImageUrl,
          message: `Received a new message from ${capitalizeFirstLetter(user.firstName)} ${capitalizeFirstLetter(user.lastName)}`,
          routing: NOTIFICATION_ROUTING_ENUM.CHAT,
          routeId: senderId,
          notificationType: NOTIFICATION_TYPE_ENUM.NEW_MESSAGE,
          session: null,
        });
      }

      await this.socketGateway.customEvents(
        new Types.ObjectId(createChatDto.receiverId),
        SOCKET_EVENTS.RECEIVE_MESSAGE,
        { document: receiverMessage.toObject() },
      );

      await this.notificationService.sendPushNotification(
        createChatDto.receiverId,
        'New message',
        `Received a new message from ${capitalizeFirstLetter(user.firstName)} ${capitalizeFirstLetter(user.lastName)}`,
        user.profileImageUrl,
        NOTIFICATION_ROUTING_ENUM.CHAT,
        senderId.toString(),
      );

      await session.commitTransaction();
      session.endSession();
      const result = await this.getConversations(createChatDto.receiverId);
      await this.socketGateway.customEvents(
        new Types.ObjectId(createChatDto.receiverId),
        SOCKET_EVENTS.CONVERSATION,
        { result },
      );
      return successHandler('Message Send Successfully', {
        document: newMessage.toObject(),
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getConversations(userId: any) {
    try {
      const [results] = await this.lastMessageModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'conversations',
            localField: 'uuid',
            foreignField: 'uuid',
            as: 'conversationDetails',
          },
        },
        { $unwind: '$conversationDetails' },
        {
          $project: {
            userId: '$userId',
            uuid: 1,
            lastMessage: 1,
            lastMessageTime: 1,
            lastMessageSendBy: 1,
            lastMessageType: 1,
            isBlocked: 1,
            createdAt: 1,
            updatedAt: 1,
            members: '$conversationDetails.members',
          },
        },
        { $unwind: '$members' },
        { $match: { members: { $ne: new Types.ObjectId(userId) } } },
        {
          $lookup: {
            from: 'blocks',
            let: { otherId: '$members' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      {
                        $and: [
                          { $eq: ['$userId', new Types.ObjectId(userId)] },
                          { $eq: ['$blockedUserId', '$$otherId'] },
                        ],
                      },
                      {
                        $and: [
                          { $eq: ['$blockedUserId', new Types.ObjectId(userId)] },
                          { $eq: ['$userId', '$$otherId'] },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'blockedUsers',
          },
        },
        { $match: { 'blockedUsers.0': { $exists: false } } },
        {
          $lookup: {
            from: 'users',
            localField: 'members',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        { $unwind: '$userDetails' },
        {
          $project: {
            _id: 1,
            lastMessage: 1,
            lastMessageSendBy: 1,
            lastMessageTime: 1,
            isBlocked: 1,
            uuid: 1,
            lastMessageType: 1,
            firstName: '$userDetails.firstName',
            lastName: '$userDetails.lastName',
            description: '$userDetails.profileDescription',
            profileImageUrl: '$userDetails.profileImageUrl',
            userId: '$userDetails._id',
            statusOnline: '$userDetails.statusOnline',
          },
        },
        {
          $lookup: {
            from: 'messages',
            localField: 'uuid',
            foreignField: 'uuid',
            as: 'messagesLookup',
          },
        },
        { $unwind: { path: '$messagesLookup', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            firstName: { $first: '$firstName' },
            userId: { $first: '$userId' },
            lastName: { $first: '$lastName' },
            profileImageUrl: { $first: '$profileImageUrl' },
            statusOnline: { $first: '$statusOnline' },
            lastMessageTime: { $first: '$lastMessageTime' },
            isBlocked: { $first: '$isBlocked' },
            lastMessageSendBy: { $first: '$lastMessageSendBy' },
            lastMessageType: { $first: '$lastMessageType' },
            lastMessage: { $first: '$lastMessage' },
            UnreadMessages: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$messagesLookup.isRead', false] },
                      {
                        $eq: [
                          '$messagesLookup.userId',
                          new Types.ObjectId(userId),
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $facet: {
            documents: [{ $sort: { lastMessageTime: -1 } }],
            totalCount: [
              {
                $group: {
                  _id: null,
                  allUnread: { $sum: '$UnreadMessages' },
                },
              },
            ],
          },
        },
      ]);

      const { documents, totalCount } = results;

      let unreadMessages = 0;
      if (totalCount && totalCount.length > 0) {
        unreadMessages = totalCount[0]['allUnread'];
      }
      return successHandler('Conversations Retrieved', {
        documents,
        unreadMessages,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllMessages(
    user: IUser,
    receiverId: Types.ObjectId,
    page: number,
    limit: number,
  ) {
    try {
      const currentUserId = user._id;
      const uuid = getNode(currentUserId, receiverId);
      const { currentPage, pageSize, skip } = paginationParams(page, limit);

      const [result] = await this.MessageModel.aggregate([
        { $match: { uuid: uuid, userId: new Types.ObjectId(currentUserId) } },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            documents: [{ $skip: skip }, { $limit: pageSize }],
            totalCount: [{ $count: 'value' }],
          },
        },
      ]);

      await this.markAsRead(currentUserId.toString(), receiverId.toString());
      const { documents, totalCount } = result;
      const totalItems = getDocumentTotal(totalCount);
      const paginated = Pagination({
        totalItems,
        page: currentPage,
        limit: pageSize,
      });

      return successHandler('success', { documents, paginated });
    } catch (error) {
      throw error;
    }
  }

  async sendFile(user: IUser, receiverId: Types.ObjectId, allFiles: any) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const senderId = user._id;
      if (!senderId || !receiverId) {
        return failureHandler(400, 'Invalid sender or receiver');
      }

      const uuid = getNode(senderId, new Types.ObjectId(receiverId));

      if (!Array.isArray(allFiles) || allFiles.length === 0) {
        return failureHandler(400, 'Files are required');
      }

      let NotifyUser = false;
      const ReceiverDetails = await this.userModel.findById(receiverId);
      if (!ReceiverDetails) {
        throw new Error('Receiver not found');
      }

      let doesChatExists = await this.ConversationModel.findOne({ uuid });

      if (!doesChatExists) {
        doesChatExists = new this.ConversationModel({
          members: [senderId, receiverId],
          uuid: uuid,
        });

        await doesChatExists.save({ session });
        NotifyUser = true;

        await this.socketGateway.customEvents(
          receiverId,
          SOCKET_EVENTS.NEW_CONVERSATION,
          {}
        );
      }

      for (const allUser of doesChatExists.members) {
        const userObjectId = new Types.ObjectId(allUser);
        let updateLastMessage = await this.lastMessageModel.findOneAndUpdate(
          { userId: userObjectId, uuid },
          {
            lastMessage: allFiles[0].originalname,
            lastMessageSendBy: senderId,
            lastMessageTime: Date.now(),
            lastMessageType: allFiles[0].mimetype,
          },
          { new: true, session }
        );

        if (!updateLastMessage) {
          updateLastMessage = new this.lastMessageModel({
            uuid,
            userId: userObjectId,
            lastMessage: allFiles[0].originalname,
            lastMessageSendBy: senderId,
            lastMessageType: allFiles[0].mimetype,
            lastMessageTime: new Date(),
          });
          await updateLastMessage.save({ session });
          NotifyUser = true;
        }

        if (updateLastMessage?.lastMessageTime) {
          const timePassedSinceLastMessage = new Date(updateLastMessage.lastMessageTime.getTime() + LAST_MESSAGE_TIME);
          if (timePassedSinceLastMessage < new Date()) {
            NotifyUser = true;
          }
        }
      }

      const allNewMessages = [];

      for (const single of allFiles) {
        const messageData = {
          uuid,
          senderId,
          messageBody: single.originalname,
          type: single.mimetype,
          fileUrl: `${process.env.AWS_CDN}${single.key}`,
        };

        const senderMessage = new this.MessageModel({
          ...messageData,
          userId: senderId,
          isRead: true,
        });

        const newSenderMessage = await senderMessage.save({ session });

        const receiverMessage = new this.MessageModel({
          ...messageData,
          userId: receiverId,
          isRead: false,
        });

        const newReceiverMessage = await receiverMessage.save({ session });

        // allNewMessages.push(newSenderMessage);

        this.socketGateway.customEvents(receiverId, SOCKET_EVENTS.RECEIVE_MESSAGE, {
          document: newReceiverMessage.toObject(),
        });

        await this.notificationService.sendPushNotification(
          receiverId.toString(),
          'New message',
          `Received a new message from ${user.firstName} ${user.lastName}`,
          user.profileImageUrl,
          NOTIFICATION_ROUTING_ENUM.CHAT,
          senderId.toString()
        );
      }

      if (NotifyUser) {
        await this.notificationService.createNotification({
          userId: receiverId,
          title: 'New message',
          icon: user.profileImageUrl,
          message: `Received a new message from ${user.firstName} ${user.lastName}`,
          routing: NOTIFICATION_ROUTING_ENUM.CHAT,
          routeId: senderId,
          notificationType: NOTIFICATION_TYPE_ENUM.NEW_MESSAGE,
        });
      }

      await session.commitTransaction();
      session.endSession();

      const result = await this.getConversations(receiverId);
      await this.socketGateway.customEvents(receiverId, SOCKET_EVENTS.CONVERSATION, { result });

      return successHandler('success', { documents: allNewMessages });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }


  async getChatFiles(
    user: IUser,
    otherUser: Types.ObjectId,
    fileSide: string,
    page: number,
    limit: number,
  ) {
    try {
      const currentUserId = user._id;

      const { currentPage, pageSize, skip } = paginationParams(page, limit);
      const uuid = getNode(currentUserId, otherUser);

      if (![ALL, MY].includes(fileSide)) {
        return successHandler('success', {
          documents: [],
          paginated: PaginatedOutput,
        });
      }

      let matchStage = {};
      if (fileSide === ALL) {
        matchStage = {
          uuid: uuid,
          userId: new mongoose.Types.ObjectId(currentUserId),
          type: { $ne: 'text' },
        };
      }

      if (fileSide === MY) {
        matchStage = {
          uuid: uuid,
          userId: new mongoose.Types.ObjectId(currentUserId),
          senderId: new mongoose.Types.ObjectId(currentUserId),
          type: { $ne: 'text' },
        };
      }

      const [allMessages] = await this.MessageModel.aggregate([
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            documents: [{ $skip: skip }, { $limit: pageSize }],
            totalCount: [{ $count: 'value' }],
          },
        },
      ]);

      const { documents, totalCount } = allMessages;
      const totalResults = getDocumentTotal(totalCount);
      const paginated = Pagination({
        page: currentPage,
        totalItems: totalResults,
        limit: pageSize,
      });

      return successHandler('success', { documents, paginated });
    } catch (error) {
      throw error;
    }
  }

  async deleteConversation(user: IUser, id: string) {
    try {
      const currentUserId = user._id;
      const receiverId = new Types.ObjectId(id);
      const uuid = getNode(currentUserId, receiverId);

      const deleteAllMessages = await this.MessageModel.deleteMany({
        uuid: uuid,
        userId: new Types.ObjectId(currentUserId),
      });
      await this.lastMessageModel.findOneAndUpdate(
        { uuid: uuid, userId: currentUserId },
        { lastMessage: '' },
      );
      return successHandler(
        `${deleteAllMessages.deletedCount} messages deleted`,
      );
    } catch (error) {
      throw error;
    }
  }

  async markAsRead(userId?: string, receiverId?: string) {
    const currentUserId = new Types.ObjectId(userId);
    const uuid = getNode(
      new Types.ObjectId(currentUserId),
      new Types.ObjectId(receiverId),
    );
    const messagesUpdated = await this.MessageModel.updateMany(
      { uuid: uuid, userId: currentUserId },
      { isRead: true },
    );
    if (messagesUpdated) return true;
    return false;
  }

  async emitCallEvent(user: IUser, receiverId: Types.ObjectId) {
    try {
      const roomId = generateNineDigitOTP();

      const session = await this.sessionService.findAllSessions(receiverId);

      await this.socketGateway.callEvents(
        new Types.ObjectId(receiverId),
        SOCKET_EVENTS.CALL,
        {
          roomId,
          userId: new Types.ObjectId(user._id),
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
        },
      );

      return { message: 'Call send Sucessfully', roomId };
    } catch (error) {
      throw error;
    }
  }
}
