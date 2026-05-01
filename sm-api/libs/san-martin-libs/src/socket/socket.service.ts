import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@san-martin/san-martin-libs/app-config/app-config.service';
import { Socket, io } from 'socket.io-client';

@Injectable()
export class SocketService {
  private socket: Socket;

  constructor(private readonly appConfigService: AppConfigService) {
    this.socket = io(this.appConfigService.socketUrl);
  }

  joinCustomRoom(room: string) {
    this.socket.emit('joinRoom', room);
  }

  leaveCustomRoom(room: string) {
    this.socket.timeout(50).emit('leaveRoom', room);
  }

  messageToClient(room, message: Record<string, unknown>) {
    this.socket.emit('msgToServer', { room, ...message });
  }
}
