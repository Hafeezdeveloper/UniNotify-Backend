// src/websockets/socket-io.adapter.ts
import {IoAdapter} from '@nestjs/platform-socket.io';
import {INestApplicationContext} from '@nestjs/common';

export class SocketIoAdapter extends IoAdapter {
  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);

    // You can customize the server instance here, for example:
    // server.origins('*:*'); // Set CORS for socket.io

    return server;
  }
}
