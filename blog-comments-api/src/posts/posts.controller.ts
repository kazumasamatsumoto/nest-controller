import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as BlogPost } from './interfaces/post.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() post: Omit<BlogPost, 'id' | 'createdAt'>): BlogPost {
    return this.postsService.create(post);
  }

  @Get()
  findAll(): BlogPost[] {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): BlogPost {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() post: Partial<BlogPost>,
  ): BlogPost {
    return this.postsService.update(id, post);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): void {
    this.postsService.delete(id);
  }
}
