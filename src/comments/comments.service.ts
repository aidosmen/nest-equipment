import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommentsByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createComment(dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        postId: dto.postId,
        userId: dto.userId,
      },
    });
  }

  async updateComment(id: number, dto: UpdateCommentDto) {
    const existing = await this.prisma.comment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Comment not found');

    return this.prisma.comment.update({
      where: { id },
      data: { content: dto.content ?? existing.content },
    });
  }

  async deleteComment(id: number) {
    const existing = await this.prisma.comment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Comment not found');

    return this.prisma.comment.delete({ where: { id } });
  }
}
