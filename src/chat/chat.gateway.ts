import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { MessageDto } from './chat.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) { }

  // userId → socketId
  private onlineUsers = new Map<number, string>();

  async afterInit() {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    this.server.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Redis Pub/Sub adapter applied to WebSocket server');
  }

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      console.log(`✅ User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        console.log(`❌ User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('chat')
  async handleMessage(
    @MessageBody() dto: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    
    const senderId = Number(client.handshake.query.userId);
    const { receiverId, content } = dto;
    console.log(`[Gateway] ${senderId} → ${receiverId} : ${content}`);

    if (!senderId || !receiverId || !content?.trim()) {
      return;
    }

    // 1. 메시지 저장
    await this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        isRead: false,
      },
    });

    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { name: true },
    });

    // 2. 수신자에게 브로드캐스트
    const targetSocketId = this.onlineUsers.get(receiverId);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('chat', {
        senderId,
        senderName: sender?.name ?? `익명(${senderId})`,
        content,
        timestamp: new Date(),
      });
    }
  }
}
