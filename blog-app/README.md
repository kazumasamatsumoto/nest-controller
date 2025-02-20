## 目的

- NestJSプロジェクトの作成方法を学ぶ
- コントローラーの基本概念を理解する
- 基本的なCRUDエンドポイントの構造を理解する

## 環境構築

### 1. NestJSのCLIをインストール

```bash
npm install -g @nestjs/cli

```

### 2. プロジェクトの作成

```bash
nest new blog-app
cd blog-app

```

↑ プロジェクト名を聞かれたら「blog-app」と入力してEnterを押してください。
パッケージマネージャーを聞かれたら「npm」を選択してください。

### 3. 開発サーバーの起動確認

```bash
npm run start:dev

```

ブラウザで [http://localhost:3000](http://localhost:3000/) にアクセスして「Hello World!」が表示されることを確認します。

## 実装手順

### 1. postsコントローラーの生成

```bash
nest generate controller posts

```

### 2. DTOの作成

まず、`src/posts`フォルダに`dto`フォルダを作成し、その中に`create-post.dto.ts`を作成します：

```tsx
// src/posts/dto/create-post.dto.ts
export class CreatePostDto {
  title: string;
  content: string;
  authorId: number;
}
```

### 3. コントローラーの実装

`src/posts/posts.controller.ts`を以下のように実装します：

```tsx
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
```

## 動作確認手順

### 1. サーバーの起動

```bash
npm run start:dev

```

### 2. APIのテスト

Postmanまたはcurlを使って以下のエンドポイントをテストします：

### 投稿の作成

```bash
curl -X POST <http://localhost:3000/posts> \\
-H "Content-Type: application/json" \\
-d '{"title": "初めての投稿", "content": "Hello NestJS!", "authorId": 1}'

```

期待される応答:

```json
{
  "id": 1,
  "title": "初めての投稿",
  "content": "Hello NestJS!",
  "authorId": 1,
  "createdAt": "2025-02-20T..."
}
```

PowerShell

```html
PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Method Post -Uri
http://localhost:3000/posts -ContentType "application/json" -Body '{"title":
"初めての投稿", "content": "Hello NestJS!", "authorId": 1}' id : 1 title :
初めての投稿 content : Hello NestJS! authorId : 1 createdAt : 2025/02/20 6:42:36
```

```html
PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Method Post -Uri
http://localhost:3000/posts -ContentType "application/json" -Body '{"title":
"初めての投稿", "content": "Hello NestJS!", "authorId": 2}' id : 2 title :
初めての投稿 content : Hello NestJS! authorId : 2 createdAt : 2025/02/20 6:44:21
```

### 全投稿の取得

```bash
curl <http://localhost:3000/posts>

```

powershell

```html
PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Method Get -Uri
http://localhost:3000/posts id : 1 title : 初めての投稿 content : Hello NestJS!
authorId : 1 createdAt : 2025/02/20 6:42:36 id : 2 title : 初めての投稿 content
: Hello NestJS! authorId : 2 createdAt : 2025/02/20 6:44:21
```

## チェックポイント

- [ ] サーバーが正常に起動できる
- [ ] POSTリクエストで新しい投稿が作成できる
- [ ] GETリクエストで投稿一覧が取得できる
- [ ] GETリクエストで個別の投稿が取得できる
- [ ] PUTリクエストで投稿が更新できる
- [ ] DELETEリクエストで投稿が削除できる

## よくある問題と解決方法

1. `nest command not found`
   - 解決: `npm install -g @nestjs/cli`を再実行
2. ポート3000が既に使用中

   - 解決: `src/main.ts`で別のポートを指定

   ```tsx
   await app.listen(3001);
   ```

3. POSTリクエストが403エラー

   - 解決: `main.ts`にCORSを追加

   ```tsx
   app.enableCors();
   ```

## 補足説明

### デコレーターの役割

- `@Controller('posts')`: URLのベースパスを`/posts`に設定
- `@Get()`: GETリクエストを処理
- `@Post()`: POSTリクエストを処理
- `@Body()`: リクエストボディを取得
- `@Param()`: URLパラメータを取得

### ファイル構造の説明

```
src/
├── posts/
│   ├── dto/
│   │   └── create-post.dto.ts
│   └── posts.controller.ts
└── main.ts

```

次の課題では、このコントローラーにサービス層を追加し、ビジネスロジックを分離していきます。

理解度を確認したい場合は、以下の質問に答えてみてください：

1. コントローラーの役割は何ですか？
2. DTOを使用する理由は何ですか？
3. 各エンドポイントがどのようなHTTPメソッドを処理するか説明できますか？
