# 課題: TODOリスト管理APIの実装

## 目的

- コントローラーのプレフィックス設定方法を理解する
- 異なるHTTPメソッドの使い分けを学ぶ
- 基本的なCRUD操作の実装方法を習得する

```powershell
# プロジェクトフォルダを作成
nest new tasks
cd tasks
```

## Step 1: フォルダとファイルの作成

### 1-1. タスクモジュールの作成

```bash
nest generate module tasks

```

### 1-2. タスクコントローラーの作成

```bash
nest generate controller tasks

```

### 1-3. タスクサービスの作成

```bash
nest generate service tasks

```

### 1-4. 必要なフォルダの作成

```bash
# dtoフォルダを作成
mkdir src/tasks/dto

# interfacesフォルダを作成
mkdir src/tasks/interfaces

```

### 1-5. 必要なファイルの作成

```bash
# create-task.dto.tsファイルを作成
touch src/tasks/dto/create-tasks.dto.ts

# task.interface.tsファイルを作成
touch src/tasks/interfaces/task.interface.ts
```

```powershell
# powershellの場合
New-Item -Path "src/tasks/dto/create-tasks.dto.ts" -ItemType "file" -Force
#powershellの場合
New-Item -Path "src/tasks/interfaces/tasks.interface.ts" -ItemType "file" -Force
```

## Step 2: 各ファイルの実装

### 2-1. create-tasks.dto.tsの実装

1. `src/tasks/dto/create-tasks.dto.ts`を開きます
2. 以下のコードをコピーして貼り付けます：

```tsx
export class CreateTaskDto {
  title: string;
  description: string;
}
```

### 2-2. task.interface.tsの実装

1. `src/tasks/interfaces/task.interface.ts`を開きます
2. 以下のコードをコピーして貼り付けます：

```tsx
export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
}
```

### 2-3. tasks.service.tsの実装

1. `src/tasks/tasks.service.ts`を開きます
2. 既存のコードを全て削除します
3. 以下のコードをコピーして貼り付けます：

```tsx
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './interfaces/tasks.interface';
import { CreateTaskDto } from './dto/create-tasks.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: this.tasks.length + 1,
      ...createTaskDto,
      isCompleted: false,
      createdAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  complete(id: number): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`タスクID: ${id} が見つかりません`);
    }
    task.isCompleted = true;
    return task;
  }

  remove(id: number): void {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new NotFoundException(`タスクID: ${id} が見つかりません`);
    }
    this.tasks.splice(index, 1);
  }
}
```

### 2-4. tasks.controller.tsの実装

1. `src/tasks/tasks.controller.ts`を開きます
2. 既存のコードを全て削除します
3. 以下のコードをコピーして貼り付けます：

```tsx
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-tasks.dto';

@Controller('todo/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.complete(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
```

## Step 3: 動作確認

### 3-1. サーバーの起動

1. ターミナルを開きます
2. 以下のコマンドを実行します：

```bash
npm run start:dev

```

### 3-2. タスクの作成

```bash
curl -X POST <http://localhost:3000/todo/tasks> \\
-H "Content-Type: application/json" \\
-d '{"title": "NestJSの学習", "description": "コントローラーの使い方を学ぶ"}'

```

powershell

```powershell
PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Uri "http://localhost:3000/todo/tasks" -Method Post -Body '{"title": "NestJSの学習", "description": "コントローラー の使い方を学ぶ"}' -ContentType "application/json"

id          : 1
title       : NestJSの学習
description : コントローラーの使い方を学ぶ
isCompleted : False
createdAt   : 2025/02/20 7:15:32
```

### 3-3. タスク一覧の取得

```bash
curl <http://localhost:3000/todo/tasks>

```

### 3-4. タスクの完了

```bash
curl -X PATCH <http://localhost:3000/todo/tasks/1/complete>

```

### 3-5. タスクの削除

```bash
curl -X DELETE <http://localhost:3000/todo/tasks/1>

```

powershellの場合

```powershell
PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Uri "http://localhost:3000/todo/tasks" -Method Post -Body '{"title": "NestJSの学習", "description": "コントローラー の使い方を学ぶ"}' -ContentType "application/json"

id          : 1
title       : NestJSの学習
description : コントローラーの使い方を学ぶ
isCompleted : False
createdAt   : 2025/02/20 7:15:32

PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Uri "http://localhost:3000/todo/tasks" -Method Get

id          : 1
title       : NestJSの学習
description : コントローラーの使い方を学ぶ
isCompleted : False
createdAt   : 2025/02/20 7:15:32

PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Uri "http://localhost:3000/todo/tasks" -Method Post -Body '{"title": "NestJSの学習", "description": "コントローラー の使い方を学ぶよ"}' -ContentType "application/json"

id          : 2
title       : NestJSの学習
description : コントローラーの使い方を学ぶよ
isCompleted : False
createdAt   : 2025/02/20 7:16:52

PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Uri "http://localhost:3000/todo/tasks" -Method Get

id          : 1
title       : NestJSの学習
description : コントローラーの使い方を学ぶ
isCompleted : False
createdAt   : 2025/02/20 7:15:32

id          : 2
title       : NestJSの学習
description : コントローラーの使い方を学ぶよ
isCompleted : False
createdAt   : 2025/02/20 7:16:52

PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Uri "http://localhost:3000/todo/tasks/1/complete" -Method Patch

id          : 1
title       : NestJSの学習
description : コントローラーの使い方を学ぶ
isCompleted : True
createdAt   : 2025/02/20 7:15:32

PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Uri "http://localhost:3000/todo/tasks/1" -Method Delete

PS C:\Users\kazum\tutorial\nest\controller> Invoke-RestMethod -Uri "http://localhost:3000/todo/tasks" -Method Get

id          : 2
title       : NestJSの学習
description : コントローラーの使い方を学ぶよ
isCompleted : False
createdAt   : 2025/02/20 7:16:52

PS C:\Users\kazum\tutorial\nest\controller>
```

## チェックポイント

### 1. プロジェクト構造の確認

- [ ] `src/tasks`フォルダが存在する
- [ ] `src/tasks/dto`フォルダが存在する
- [ ] `src/tasks/interfaces`フォルダが存在する
- [ ] 必要なすべてのファイルが作成されている

### 2. サーバー起動の確認

- [ ] `npm run start:dev`でサーバーが起動する
- [ ] エラーメッセージが表示されていない

### 3. APIエンドポイントの動作確認

### タスクの作成（POST）

- [ ] タスクが正常に作成される
- [ ] レスポンスにIDが含まれている
- [ ] isCompletedがfalseで作成される

### タスク一覧の取得（GET）

- [ ] 作成したタスクが取得できる
- [ ] 配列形式でデータが返る

### タスクの完了（PATCH）

- [ ] isCompletedがtrueに更新される
- [ ] 存在しないIDの場合はエラーが返る

### タスクの削除（DELETE）

- [ ] タスクが正常に削除される
- [ ] 削除後の一覧で該当タスクが表示されない

## トラブルシューティング

### エラー1: モジュールが見つからない

対処方法:

1. `src/app.module.ts`を開く
2. `imports`配列に`TasksModule`が含まれているか確認
3. なければ以下のように追加：

```tsx
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
})

```

### エラー2: タスクが作成できない

対処方法:

1. リクエストのContent-Typeが正しいか確認
2. リクエストボディのプロパティ名が正しいか確認
3. curlコマンドを再確認

### エラー3: 404エラーが発生

対処方法:

1. URLが正しいか確認（`/todo/tasks`になっているか）
2. コントローラーのプレフィックスが正しく設定されているか確認

## 補足説明

- `@Controller('todo/tasks')`でプレフィックスを指定することで、すべてのエンドポイントに`/todo/tasks`が付与されます
- `@Patch`はリソースの部分的な更新に使用します（今回はタスクの完了状態のみを更新）
- `ParseIntPipe`はURLパラメータを数値に変換する役割があります

次の課題では、バリデーションを追加してユーザー入力のチェックを実装していきます。
