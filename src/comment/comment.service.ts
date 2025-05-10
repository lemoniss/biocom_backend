import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommentDto } from './comment.dto';

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, dto: CommentDto) {
        return this.prisma.comment.create({
            data: {
                userId,
                postId: dto.postId,
                content: dto.content,
            }, 
        });
    }

    async findByPost(postId: number) {
        return this.prisma.comment.findMany({
            where: { postId, isDel: false },
            include: { user: true },
            orderBy: { id: 'asc' },
        });
    }

    async update(id: number, dto: CommentDto) {
        return this.prisma.comment.update({
            where: { id },
            data: { content: dto.content },
        });
    }

    async delete(id: number) { 
        return this.prisma.comment.update({
            where: { id },
            data: { isDel: true },
        });
    }
}
