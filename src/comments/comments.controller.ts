import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('post/:postId')
  async getCommentsByPostId(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.getCommentsByPostId(postId);
  }

  @Post()
  async createComment(@Body() dto: CreateCommentDto) {
    return this.commentsService.createComment(dto);
  }

  @Patch(':id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(id, dto);
  }

  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.deleteComment(id);
  }
}
