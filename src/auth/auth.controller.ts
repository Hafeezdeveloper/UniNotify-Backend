import {Controller, Get, Request} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get user profile'})
  getProfile(@Request() req) {
    return req.user;
  }
}
