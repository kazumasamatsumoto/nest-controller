import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostInterface } from './interfaces/post.interface';

@Controller('posts')
export class PostsController {
  private posts: PostInterface[] = [];

  @Get()
  findAll(): PostInterface[] {
    return this.posts;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posts.find((post) => post.id === Number(id));
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    const newPost = {
      id: this.posts.length + 1,
      ...createPostDto,
      createdAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: CreatePostDto) {
    const index = this.posts.findIndex((post) => post.id === Number(id));
    if (index > -1) {
      this.posts[index] = {
        ...this.posts[index],
        ...updatePostDto,
        updatedAt: new Date(),
      };
      return this.posts[index];
    }
    return { error: 'Post not found' };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const index = this.posts.findIndex((post) => post.id === Number(id));
    if (index > -1) {
      const deletedPost = this.posts[index];
      this.posts.splice(index, 1);
      return deletedPost;
    }
    return { error: 'Post not found' };
  }
}
