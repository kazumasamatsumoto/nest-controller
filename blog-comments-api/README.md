# ブログ記事とコメントAPI構築チュートリアル

## 目的

- ネストされたリソース（記事とコメント）の関係を理解する
- RESTful APIのベストプラクティスを学ぶ
- NestJSでの親子関係のあるAPIの実装方法を理解する

## 実装手順

### Step 1: プロジェクトのセットアップ

```bash
# プロジェクトフォルダを作成
nest new blog-comments-api
cd blog-comments-api

# 必要なモジュールを生成
nest generate module posts
nest generate module comments
nest generate controller posts
nest generate controller comments
nest generate service posts
nest generate service comments

# インターフェース用のフォルダを作成
mkdir src/posts/interfaces
mkdir src/comments/interfaces

# インターフェースファイルを作成
touch src/posts/interfaces/post.interface.ts
touch src/comments/interfaces/comment.interface.ts

```

powershell

```powershell
New-Item -ItemType File -Path "src/posts/interfaces/post.interface.ts" -Force
New-Item -ItemType File -Path "src/comments/interfaces/comment.interface.ts" -Force
```

作成後のフォルダ構造:

```
src/
├── app.module.ts
├── posts/
│   ├── interfaces/
│   │   └── post.interface.ts
│   ├── posts.module.ts
│   ├── posts.controller.ts
│   └── posts.service.ts
└── comments/
    ├── interfaces/
    │   └── comment.interface.ts
    ├── comments.module.ts
    ├── comments.controller.ts
    └── comments.service.ts

```

### Step 2: インターフェースの実装

1. `src/posts/interfaces/post.interface.ts` を開き、以下のコードを追加:

```tsx
export interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: Date;
}
```

1. `src/comments/interfaces/comment.interface.ts` を開き、以下のコードを追加:

```tsx
export interface Comment {
  id: number;
  postId: number;
  content: string;
  authorName: string;
  createdAt: Date;
}
```

### Step 3: サービスの実装

1. `src/posts/posts.service.ts` を開き、以下のコードを追加:

```tsx
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
      throw new NotFoundException(`投稿ID ${id} が見つかりません`);
    }
    return post;
  }

  update(id: number, post: Partial<Post>): Post {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`投稿ID ${id} が見つかりません`);
    }
    this.posts[index] = { ...this.posts[index], ...post };
    return this.posts[index];
  }

  delete(id: number): void {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`投稿ID ${id} が見つかりません`);
    }
    this.posts.splice(index, 1);
  }
}
```

1. `src/comments/comments.service.ts` を開き、以下のコードを追加:

```tsx
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
```

### Step 4: コントローラーの実装

1. `src/posts/posts.controller.ts` を開き、以下のコードを追加:

```tsx
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
```

1. `src/comments/comments.controller.ts` を開き、以下のコードを追加:

```tsx
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
```

### Step 5: アプリケーションの起動と動作確認

1. サーバーを起動:

```bash
npm run start:dev

```

1. APIのテスト:

```bash
# 記事を作成
curl -X POST <http://localhost:3000/posts> -H "Content-Type: application/json" -d '{"title": "初めての投稿", "content": "これは投稿の内容です", "authorName": "山田太郎"}'

# 記事にコメントを追加
curl -X POST <http://localhost:3000/posts/1/comments> -H "Content-Type: application/json" -d '{"content": "素晴らしい記事ですね！", "authorName": "佐藤花子"}'

# 記事の一覧を取得
curl <http://localhost:3000/posts>

# 特定の記事のコメント一覧を取得
curl <http://localhost:3000/posts/1/comments>

```

powershell

```powershell
# 記事を作成
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/posts" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"title": "初めての投稿", "content": "これは投稿の内容です", "authorName": "山田太郎"}'

# 記事にコメントを追加
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/posts/1/comments" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"content": "素晴らしい記事ですね！", "authorName": "佐藤花子"}'

# 記事の一覧を取得
Invoke-RestMethod -Uri "http://localhost:3000/posts"

# 特定の記事のコメント一覧を取得
Invoke-RestMethod -Uri "http://localhost:3000/posts/1/comments"
```

結果

```powershell
S C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Method Post -Uri "http://localhost:3000/posts" `
>>   -Headers @{"Content-Type"="application/json"} `
>>   -Body '{"title": "初めての投稿", "content": "これは投稿の内容です", "authorName": "山田太郎"}'

id         : 1
title      : 初めての投稿
content    : これは投稿の内容です
authorName : 山田太郎
createdAt  : 2025/02/21 3:39:38

PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Method Post -Uri "http://localhost:3000/posts/1/comments" `
>>   -Headers @{"Content-Type"="application/json"} `
>>   -Body '{"content": "素晴らしい記事ですね！", "authorName": "佐藤花子"}'

id         : 2
postId     : 1
content    : 素晴らしい記事ですね！
authorName : 佐藤花子
createdAt  : 2025/02/21 3:39:41

PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Uri "http://localhost:3000/posts"

id         : 1
title      : 初めての投稿
content    : これは投稿の内容です
authorName : 山田太郎
createdAt  : 2025/02/21 3:39:38

PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Uri "http://localhost:3000/posts/1/comments"

id         : 1
postId     : 1
content    : 素晴らしい記事ですね！
authorName : 佐藤花子
createdAt  : 2025/02/21 3:39:12
```

## チェックポイント

- [ ] すべてのファイルが正しく作成されている
- [ ] サーバーが正常に起動する
- [ ] 記事の作成、取得、更新、削除ができる
- [ ] コメントの作成、取得、削除ができる
- [ ] 記事IDに紐づいたコメントが正しく取得できる

## トラブルシューティング

### エラー1: ルーティングエラー

```
Cannot POST /posts/1/comments

```

解決方法:

1. `app.module.ts` で両方のモジュールが正しくインポートされているか確認
2. コントローラーのパスが正しいか確認

### エラー2: パラメータ変換エラー

```
Validation failed (numeric string is expected)

```

解決方法:

1. URLのパラメータ（postId, id）が数値であることを確認
2. `ParseIntPipe` が正しく適用されているか確認

## 補足情報

- このAPIでは記事とコメントの関係を1対多の関係として実装しています
- メモリ内のデータは一時的なものです
- 実運用では、以下の機能を追加することをお勧めします：
  1. データベースの導入
  2. バリデーションの追加
  3. ページネーションの実装
  4. ユーザー認証の追加
