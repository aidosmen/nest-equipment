import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(dto: { title: string; content?: string; userId: number }) {
    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId: dto.userId,
      },
    });
  }

  async getAll() {
    return this.prisma.post.findMany({ include: { user: true } });
  }
}
