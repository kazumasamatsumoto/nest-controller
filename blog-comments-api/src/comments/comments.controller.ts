import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './interfaces/comment.interface';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() comment: Omit<Comment, 'id' | 'postId' | 'createdAt'>,
  ): Comment {
    return this.commentsService.create(postId, comment);
  }

  @Get()
  findByPostId(@Param('postId', ParseIntPipe) postId: number): Comment[] {
    return this.commentsService.findByPostId(postId);
  }

  @Get(':id')
  findOne(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Comment {
    return this.commentsService.findOne(postId, id);
  }

  @Delete(':id')
  delete(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
  ): void {
    this.commentsService.delete(postId, id);
  }
}
