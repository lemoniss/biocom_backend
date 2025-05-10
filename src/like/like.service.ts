import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async toggleLike(userId: number, postId: number) {
    const existing = await this.prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      return { liked: false, likeCount: await this.count(postId) };
    } else {
      await this.prisma.like.create({
        data: { userId, postId },
      });
      return { liked: true, likeCount: await this.count(postId) };
    }
  }

  async count(postId: number) { 
    return this.prisma.like.count({ where: { postId } });
  }
}
