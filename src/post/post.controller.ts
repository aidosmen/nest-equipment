import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  create(@Body() dto: { title: string; content?: string; userId: number }) {
    return this.postService.createPost(dto);
  }

  @Get()
  getAll() {
    return this.postService.getAll();
  }
}
