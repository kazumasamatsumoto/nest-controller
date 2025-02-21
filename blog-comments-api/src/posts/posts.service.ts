import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostsService {
  private posts: Post[] = [];

  create(post: Omit<Post, 'id' | 'createdAt'>): Post {
    const newPost: Post = {
      id: this.posts.length + 1,
      ...post,
      createdAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post {
    const post = this.posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException(`投稿ID${id}が見つかりません`);
    }
    return post;
  }

  update(id: number, post: Partial<Post>): Post {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`投稿ID${id}が見つかりません`);
    }
    this.posts[index] = { ...this.posts[index], ...post };
    return this.posts[index];
  }

  delete(id: number): void {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`投稿ID${id}が見つかりません`);
    }
    this.posts.splice(index, 1);
  }
}
