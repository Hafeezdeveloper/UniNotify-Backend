import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Param,
  UseInterceptors,
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import {ChatService} from './chat.service';
import {CreateChatDto, SendFileDto} from './dto/create-chat.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  createApiResponse,
  failureHandler,
} from 'src/lib/helpers/utility.helpers';
import mongoose, {Types} from 'mongoose';
import {createFileUploadConfig} from 'src/config/multerConfig';
import {FilesInterceptor} from '@nestjs/platform-express';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Send a new message'})
  @ApiBody({type: CreateChatDto})
  @createApiResponse(201, 'Message sent successfully.', true)
  @createApiResponse(400, 'Bad request.', false)
  @createApiResponse(404, 'User not found.', false)
  async sendNewMessage(@Body() createChatDto: CreateChatDto, @Req() req: any) {
    const {user} = req;
    return this.chatService.sendNewMessage(user, createChatDto);
  }

  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Retrieve Previous conversation'})
  @createApiResponse(201, 'Message sent successfully.', true)
  @createApiResponse(400, 'Bad request.', false)
  @createApiResponse(404, 'User not found.', false)
  async getConversation(@Req() req: any) {
    const {user} = req;
    const currentUserId = user._id;
    return this.chatService.getConversations(currentUserId);
  }

  @Get('messages/:id')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Retrieve previous messages with pagination'})
  @ApiParam({
    name: 'id',
    required: true,
    description: 'report id ',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of messages per page',
  })
  @createApiResponse(200, 'success', true)
  async getAllMessages(
    @Req() req: any,
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const {user} = req;
    const receiverId = new Types.ObjectId(id);

    return this.chatService.getAllMessages(user, receiverId, page, limit);
  }

  @Post('send-file')
  @ApiBearerAuth()
  @ApiOperation({summary: 'send files'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: SendFileDto})
  @createApiResponse(201, 'success', true)
  @createApiResponse(400, 'Bad Request', false)
  @UseInterceptors(
    FilesInterceptor(
      'files',
      10,
      createFileUploadConfig({prefix: 'chat', fileSizeLimit: 10 * 1024 * 1024}),
    ),
  )
  async sendChatFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() sendFileDto: SendFileDto,
    @Req() req: any,
  ) {
    const {user} = req;
    const receiver = new Types.ObjectId(sendFileDto.receiverId);

    return this.chatService.sendFile(user, receiver, files);
  }

  @Get('files/:fileSide/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'fileSide',
    type: String,
    description: 'File side (all, my)',
    example: 'my',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Other user ID',
    example: '605c72ef9f1b2c3b88d8e5a1',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of files per page',
  })
  @createApiResponse(200, 'Successfully retrieved chat files', true)
  @createApiResponse(400, 'Invalid request parameters', false)
  async getChatFiles(
    @Req() req: any,
    @Param('fileSide') fileSide: string,
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const {user} = req;

    if (!id || !mongoose.isValidObjectId(id)) {
      return failureHandler(400, 'invalid id');
    }

    const otherUserId = new Types.ObjectId(id);

    return this.chatService.getChatFiles(
      user,
      otherUserId,
      fileSide,
      page,
      limit,
    );
  }

  @Delete('conversation/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the user with whom the conversation is to be deleted',
  })
  @createApiResponse(200, '10 messages deleted', true)
  @createApiResponse(400, 'Invalid request parameters', false)
  async deleteConversation(@Req() req: any, @Param('id') id: string) {
    const {user} = req;
    return this.chatService.deleteConversation(user, id);
  }

  @Get('/send-call/:receiverId')
  async emitCustomerCall(
    @Req() req: any,
    @Param('receiverId') receiverId: string,
  ) {
    const {user} = req;
    return this.chatService.emitCallEvent(user, new Types.ObjectId(receiverId));
  }
}
