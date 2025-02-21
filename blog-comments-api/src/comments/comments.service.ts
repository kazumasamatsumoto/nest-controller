import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from './interfaces/comment.interface';

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];

  create(
    postId: number,
    comment: Omit<Comment, 'id' | 'postId' | 'createdAt'>,
  ): Comment {
    const newComment: Comment = {
      id: this.comments.length + 1,
      postId,
      ...comment,
      createdAt: new Date(),
    };
    this.comments.push(newComment);
    return newComment;
  }

  findByPostId(postId: number): Comment[] {
    return this.comments.filter((comment) => comment.postId === postId);
  }

  findOne(postId: number, id: number): Comment {
    const comment = this.comments.find(
      (c) => c.postId === postId && c.id === id,
    );
    if (!comment) {
      throw new NotFoundException(`コメントID ${id} が見つかりません`);
    }
    return comment;
  }

  delete(postId: number, id: number): void {
    const index = this.comments.findIndex(
      (c) => c.postId === postId && c.id === id,
    );
    if (index === -1) {
      throw new NotFoundException(`コメントID ${id} が見つかりません`);
    }
    this.comments.splice(index, 1);
  }
}
