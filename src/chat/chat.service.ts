import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getMessagesBetween(userId: number, targetUserId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });
  }

  async markMessageAsRead(userId: number, messageId: number) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });
  
    if (!message || message.receiverId !== userId) {
      throw new Error('읽을 수 없는 메시지입니다.');
    }
  
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }
  
  async getUnreadCounts(userId: number) {
    const unreadMessages = await this.prisma.message.findMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      select: {
        senderId: true,
      },
    });
  
    const counts: Record<number, number> = {};
  
    for (const msg of unreadMessages) {
      counts[msg.senderId] = (counts[msg.senderId] || 0) + 1;
    }
  
    return Object.entries(counts).map(([senderId, count]) => ({
      senderId: Number(senderId),
      count,
    }));
  }
  
}
