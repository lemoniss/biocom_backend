// src/post/post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, content: string, imageUrl?: string) {
    return this.prisma.post.create({
      data: {
        userId,
        content,
        imageUrl,
      },
    });
  }

  async findAll() {
    const posts = await this.prisma.post.findMany({
      where: {
        isDel: false, // 삭제되지 않은 게시물만
      },
      include: {
        user: true,
        _count: {
          select: { likes: true },
        },
        likes: {
          select: { id: true },
        },
      },
      orderBy: {
        id: 'desc'
      }
    });
    
    return posts.map((post) => ({
      ...post,
      likeCount: post._count.likes,
      liked: post.likes.length > 0,
    }));    
  }
  

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post || post.isDel) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: number, content: string, imageUrl?: string) {
    return this.prisma.post.update({
      where: { id },
      data: { content, imageUrl },
    });
  }

  async delete(id: number) {
    return this.prisma.post.update({
      where: { id },
      data: { isDel: true },
    });
  }
}
