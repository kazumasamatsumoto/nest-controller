## Step 1: フォルダとファイルの作成

```powershell
# プロジェクトフォルダを作成
nest new memo
cd memo
```

### 1-1. メモモジュールの作成

```bash
nest generate module memos

```

### 1-2. メモコントローラーの作成

```bash
nest generate controller memos

```

### 1-3. メモサービスの作成

```bash
nest generate service memos

```

### 1-4. 必要なフォルダの作成

```bash
# dtoフォルダを作成
mkdir src/memos/dto

# interfacesフォルダを作成
mkdir src/memos/interfaces

```

### 1-5. 必要なファイルの作成

```bash
# create-memo.dto.tsファイルを作成
touch src/memos/dto/create-memo.dto.ts

# update-memo.dto.tsファイルを作成
touch src/memos/dto/update-memo.dto.ts

# memo.interface.tsファイルを作成
touch src/memos/interfaces/memo.interface.ts

```

powershell

```powershell
PS C:\Users\kazum\tutorial\nest\controller\memo> New-Item -Path "src/memos/dto/create-memo.dto.ts" -ItemType "file" -Force

PS C:\Users\kazum\tutorial\nest\controller\memo> New-Item -Path "src/memos/dto/update-memo.dto.ts" -ItemType "file" -Force

PS C:\Users\kazum\tutorial\nest\controller\memo> New-Item -Path "src/memos/interfaces/memo.interface.ts" -ItemType "file" -Force
```

## Step 2: 各ファイルの実装

### 2-1. create-memo.dto.tsの実装

1. Visual Studio Codeで`src/memos/dto/create-memo.dto.ts`を開きます
2. 以下のコードをコピーして貼り付けます：

```tsx
export class CreateMemoDto {
  title: string;
  content: string;
}
```

### 2-2. update-memo.dto.tsの実装

1. `src/memos/dto/update-memo.dto.ts`を開きます
2. 以下のコードをコピーして貼り付けます：

```tsx
export class UpdateMemoDto {
  title?: string;
  content?: string;
}
```

### 2-3. memo.interface.tsの実装

1. `src/memos/interfaces/memo.interface.ts`を開きます
2. 以下のコードをコピーして貼り付けます：

```tsx
export interface Memo {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2-4. memos.service.tsの実装

1. `src/memos/memos.service.ts`を開きます
2. 既存のコードを全て削除します
3. 以下のコードをコピーして貼り付けます：

```tsx
import { Injectable, NotFoundException } from '@nestjs/common';
import { Memo } from './interfaces/memo.interface';
import { CreateMemoDto } from './dto/create-memo.dto';
import { UpdateMemoDto } from './dto/update-memo.dto';

@Injectable()
export class MemosService {
  private memos: Memo[] = [];

  findAll(): Memo[] {
    return this.memos;
  }

  findOne(id: number): Memo {
    const memo = this.memos.find((memo) => memo.id === id);
    if (!memo) {
      throw new NotFoundException(`メモID: ${id} が見つかりません`);
    }
    return memo;
  }

  create(createMemoDto: CreateMemoDto): Memo {
    const newMemo: Memo = {
      id: this.memos.length + 1,
      ...createMemoDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memos.push(newMemo);
    return newMemo;
  }

  update(id: number, updateMemoDto: UpdateMemoDto): Memo {
    const memoIndex = this.memos.findIndex((memo) => memo.id === id);
    if (memoIndex === -1) {
      throw new NotFoundException(`メモID: ${id} が見つかりません`);
    }

    this.memos[memoIndex] = {
      ...this.memos[memoIndex],
      ...updateMemoDto,
      updatedAt: new Date(),
    };

    return this.memos[memoIndex];
  }

  remove(id: number): void {
    const memoIndex = this.memos.findIndex((memo) => memo.id === id);
    if (memoIndex === -1) {
      throw new NotFoundException(`メモID: ${id} が見つかりません`);
    }
    this.memos.splice(memoIndex, 1);
  }
}
```

### 2-5. memos.controller.tsの実装

1. `src/memos/memos.controller.ts`を開きます
2. 既存のコードを全て削除します
3. 以下のコードをコピーして貼り付けます：

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
import { MemosService } from './memos.service';
import { CreateMemoDto } from './dto/create-memo.dto';
import { UpdateMemoDto } from './dto/update-memo.dto';

@Controller('memos')
export class MemosController {
  constructor(private readonly memosService: MemosService) {}

  @Get()
  findAll() {
    return this.memosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.memosService.findOne(id);
  }

  @Post()
  create(@Body() createMemoDto: CreateMemoDto) {
    return this.memosService.create(createMemoDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemoDto: UpdateMemoDto,
  ) {
    return this.memosService.update(id, updateMemoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.memosService.remove(id);
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

### 3-2. 新しいメモの作成

1. 新しいターミナルを開きます
2. 以下のコマンドをコピーして実行します：

```bash
curl -X POST <http://localhost:3000/memos> \\
-H "Content-Type: application/json" \\
-d '{"title": "買い物リスト", "content": "1. 牛乳\\n2. パン\\n3. 卵"}'

```

```powershell
PS C:\Users\kazum\tutorial\nest\controller> Invoke-WebRequest -Uri "http://localhost:3000/memos" `
>> -Method POST `
>> -Headers @{"Content-Type"="application/json"} `
>> -Body '{"title": "買い物リスト", "content": "1. 牛乳\n2. パン\n3. 卵"}'

StatusCode        : 201
StatusDescription : Created
Content           : {"id":2,"title":"買い物リスト","content":"1. 牛乳\n2. パン\n3. 卵","createdAt":"2025-02-20T11:01:43.315Z","updatedAt":"2025-02-20T11:01:43.315Z"}
RawContent        : HTTP/1.1 201 Created
                    X-Powered-By: Express
                    ETag: W/"9c-y6jmv4A02B95np2iNQbvZFv/bTA"
                    Date: Thu, 20 Feb 2025 11:01:43 GMT
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Type: application/jso…
Headers           : {[X-Powered-By, System.String[]], [ETag, System.String[]], [Date, System.String[]], [Connection, System.String[]]…}
Images            : {}
InputFields       : {}
Links             : {}
RawContentLength  : 156
RelationLink      : {}

PS C:\Users\kazum\tutorial\nest\controller>
```

### 3-3. メモの取得

以下のコマンドを実行してメモを取得します：

```bash
curl <http://localhost:3000/memos/1>

```

```powershell
PS C:\Users\kazum\tutorial\nest\controller> Invoke-WebRequest -Uri "http://localhost:3000/memos" `
>> -Method GET

StatusCode        : 200
StatusDescription : OK
Content           : [{"id":1,"createdAt":"2025-02-20T11:01:17.280Z","updatedAt":"2025-02-20T11:01:17.280Z"},{"id":2,"title":"買い物リスト","content":"1. 牛乳\n2. パン\n3. 卵","cr
                    eatedAt":"2025-02-20T11:01:43.315Z","updatedAt":"2025…
RawContent        : HTTP/1.1 200 OK
                    X-Powered-By: Express
                    ETag: W/"f5-HuHyNjyY4+1FowUZR+doZbQ8yjY"
                    Date: Thu, 20 Feb 2025 11:02:24 GMT
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Type: application/json; ch…
Headers           : {[X-Powered-By, System.String[]], [ETag, System.String[]], [Date, System.String[]], [Connection, System.String[]]…}
Images            : {}
InputFields       : {}
Links             : {}
RawContentLength  : 245
RelationLink      : {}

PS C:\Users\kazum\tutorial\nest\controller>
```

### 3-4. メモの更新

以下のコマンドを実行してメモを更新します：

```bash
curl -X PUT <http://localhost:3000/memos/1> \\
-H "Content-Type: application/json" \\
-d '{"title": "更新された買い物リスト", "content": "1. 牛乳\\n2. パン\\n3. 卵\\n4. バター"}'

```

```powershell
PS C:\Users\kazum\tutorial\nest\controller> Invoke-WebRequest -Uri "http://localhost:3000/memos/1" `
>> -Method PUT `
>> -Headers @{"Content-Type"="application/json"} `
>> -Body '{"title": "更新された買い物リスト", "content": "1. 牛乳\n2. パン\n3. 卵\n4. バター"}'

StatusCode        : 200
StatusDescription : OK
Content           : {"id":1,"createdAt":"2025-02-20T11:01:17.280Z","updatedAt":"2025-02-20T11:03:05.023Z","title":"更新された買い物リスト","content":"1. 牛乳\n2. パン\n3. 卵\n4.
                    バター"}
RawContent        : HTTP/1.1 200 OK
                    X-Powered-By: Express
                    ETag: W/"b9-0VvnpvKfB9Ri2n2AZJpU++dxxKw"
                    Date: Thu, 20 Feb 2025 11:03:05 GMT
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Type: application/json; ch…
Headers           : {[X-Powered-By, System.String[]], [ETag, System.String[]], [Date, System.String[]], [Connection, System.String[]]…}
Images            : {}
InputFields       : {}
Links             : {}
RawContentLength  : 185
RelationLink      : {}

PS C:\Users\kazum\tutorial\nest\controller> Invoke-WebRequest -Uri "http://localhost:3000/memos" `
>> -Method GET

StatusCode        : 200
StatusDescription : OK
Content           : [{"id":1,"createdAt":"2025-02-20T11:01:17.280Z","updatedAt":"2025-02-20T11:03:05.023Z","title":"更新された買い物リスト","content":"1. 牛乳\n2. パン\n3. 卵\n4.
                     バター"},{"id":2,"title":"買い物リスト","content":"1. 牛乳\n2. パン\n3…
RawContent        : HTTP/1.1 200 OK
                    X-Powered-By: Express
                    ETag: W/"158-QRHCRwV8KpSFlj6+1YBb2j7fv4U"
                    Date: Thu, 20 Feb 2025 11:03:23 GMT
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Type: application/json; c…
Headers           : {[X-Powered-By, System.String[]], [ETag, System.String[]], [Date, System.String[]], [Connection, System.String[]]…}
Images            : {}
InputFields       : {}
Links             : {}
RawContentLength  : 344
RelationLink      : {}

PS C:\Users\kazum\tutorial\nest\controller>
```

### 3-5. メモの削除

以下のコマンドを実行してメモを削除します：

```bash
curl -X DELETE <http://localhost:3000/memos/1>

```

```powershell
PS C:\Users\kazum\tutorial\nest\controller> Invoke-WebRequest -Uri "http://localhost:3000/memos/1" `
>> -Method DELETE

StatusCode        : 200
StatusDescription : OK
Content           : {}
RawContent        : HTTP/1.1 200 OK
                    X-Powered-By: Express
                    Date: Thu, 20 Feb 2025 11:04:00 GMT
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Length: 0

Headers           : {[X-Powered-By, System.String[]], [Date, System.String[]], [Connection, System.String[]], [Keep-Alive, System.String[]]…}
RawContentLength  : 0
RelationLink      : {}

PS C:\Users\kazum\tutorial\nest\controller> Invoke-WebRequest -Uri "http://localhost:3000/memos" `
>> -Method GET

StatusCode        : 200
StatusDescription : OK
Content           : [{"id":2,"title":"買い物リスト","content":"1. 牛乳\n2. パン\n3. 卵","createdAt":"2025-02-20T11:01:43.315Z","updatedAt":"2025-02-20T11:01:43.315Z"}]
RawContent        : HTTP/1.1 200 OK
                    X-Powered-By: Express
                    ETag: W/"9e-aVDLWmRM5PkaYmxufsv59EQZpKM"
                    Date: Thu, 20 Feb 2025 11:04:04 GMT
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Type: application/json; ch…
Headers           : {[X-Powered-By, System.String[]], [ETag, System.String[]], [Date, System.String[]], [Connection, System.String[]]…}
Images            : {}
InputFields       : {}
Links             : {}
RawContentLength  : 158
RelationLink      : {}

PS C:\Users\kazum\tutorial\nest\controller>
```

## トラブルシューティング

### エラー1: モジュールが見つからない

対処方法:

1. `src/app.module.ts`を開く
2. `imports`配列に`MemosModule`が含まれているか確認
3. なければ以下のように追加：

```tsx
import { MemosModule } from './memos/memos.module';

@Module({
  imports: [MemosModule],
})

```

### エラー2: サーバーが起動しない

対処方法:

1. すべてのファイルが保存されているか確認
2. ターミナルで`npm run start:dev`を再実行
3. エラーメッセージを確認して、該当するファイルの修正を行う

各ステップで問題が発生した場合は、すぐに質問してください！

# 課題2の理解度チェック

## 実装の確認

### 1. プロジェクト構造の確認

- [ ] `src/memos`フォルダが存在する
- [ ] `src/memos/dto`フォルダが存在する
- [ ] `src/memos/interfaces`フォルダが存在する
- [ ] 必要なすべてのファイルが作成されている

### 2. サーバー起動の確認

- [ ] `npm run start:dev`でサーバーが起動する
- [ ] エラーメッセージが表示されていない

### 3. APIエンドポイントの動作確認

### メモの作成（POST）

```bash
curl -X POST <http://localhost:3000/memos> \\
-H "Content-Type: application/json" \\
-d '{"title": "テストメモ", "content": "テスト内容"}'

```

- [ ] 200系のレスポンスが返ってくる
- [ ] 作成したメモのIDが返ってくる
- [ ] レスポンスに`createdAt`と`updatedAt`が含まれている

### メモ一覧の取得（GET）

```bash
curl <http://localhost:3000/memos>

```

- [ ] 空の配列または作成したメモの一覧が返ってくる
- [ ] エラーが発生しない

### 個別メモの取得（GET）

```bash
curl <http://localhost:3000/memos/1>

```

- [ ] 指定したIDのメモが返ってくる
- [ ] 存在しないIDの場合はエラーメッセージが返ってくる

### メモの更新（PUT）

```bash
curl -X PUT <http://localhost:3000/memos/1> \\
-H "Content-Type: application/json" \\
-d '{"title": "更新されたメモ", "content": "更新された内容"}'

```

- [ ] 更新されたメモの内容が返ってくる
- [ ] `updatedAt`の時刻が更新されている

### メモの削除（DELETE）

```bash
curl -X DELETE <http://localhost:3000/memos/1>

```

- [ ] メモが正常に削除される
- [ ] 削除後にGETで確認すると該当メモが存在しない

### 4. エラーハンドリングの確認

- [ ] 存在しないIDへのGETリクエストで404エラーが返る
- [ ] 存在しないIDへのPUTリクエストで404エラーが返る
- [ ] 存在しないIDへのDELETEリクエストで404エラーが返る

### 5. コード理解の確認

- [ ] `@Injectable()`デコレータの役割が理解できている
- [ ] `@Controller('memos')`の意味が理解できている
- [ ] DTOとインターフェースの違いが理解できている
- [ ] サービスとコントローラーの責務の違いが理解できている

## 完了条件

上記のすべてのチェック項目にチェックが入ったら、課題2は完了です！

分からない項目があれば、以下のどの部分が理解できていないか教えてください：

1. ファイル構造
2. サーバー起動
3. APIリクエスト
4. エラーハンドリング
5. コードの意味
