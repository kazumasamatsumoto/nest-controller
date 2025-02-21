# ファイル管理API構築チュートリアル

## 目的

- NestJSでのファイル操作の基本を理解する
- ファイルアップロード機能の実装方法を学ぶ
- リソースモジュールの生成と使用方法を理解する

## 実装手順

### Step 1: プロジェクトのセットアップ

```bash
# プロジェクトフォルダを作成
nest new file-management-api
cd file-management-api

# 必要なパッケージをインストール
npm install --save @nestjs/platform-express multer
npm install --save-dev @types/multer

# filesリソースを生成（CRUD操作含む）
nest generate resource files

PS C:\Users\kazum\tutorial\nest\controller\file-management-api> nest g resource files
✔ What transport layer do you use? REST API
✔ Would you like to generate CRUD entry points? Yes
CREATE src/files/files.controller.ts (928 bytes)
CREATE src/files/files.controller.spec.ts (586 bytes)
CREATE src/files/files.module.ts (257 bytes)
CREATE src/files/files.service.ts (635 bytes)
CREATE src/files/files.service.spec.ts (471 bytes)
CREATE src/files/dto/create-file.dto.ts (31 bytes)
CREATE src/files/dto/update-file.dto.ts (173 bytes)
CREATE src/files/entities/file.entity.ts (22 bytes)
UPDATE package.json (2218 bytes)
UPDATE src/app.module.ts (322 bytes)
✔ Packages installed successfully.

# アップロードされたファイルの保存用フォルダを作成
mkdir src/uploads

```

作成後のフォルダ構造:

```
src/
├── app.module.ts
├── files/
│   ├── dto/
│   │   ├── create-file.dto.ts
│   │   └── update-file.dto.ts
│   ├── entities/
│   │   └── file.entity.ts
│   ├── files.controller.ts
│   ├── files.module.ts
│   └── files.service.ts
└── uploads/

```

### Step 2: DTOとエンティティの実装

1. `src/files/dto/create-file.dto.ts` を開き、以下のコードを追加:

```tsx
export class CreateFileDto {
  originalName: string;
  description?: string;
}
```

1. `src/files/dto/update-file.dto.ts` を開き、以下のコードを追加:

```tsx
import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDto } from './create-file.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
```

1. `src/files/entities/file.entity.ts` を開き、以下のコードを追加:

```tsx
export class File {
  id: number;
  originalName: string;
  fileName: string;
  description?: string;
  path: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}
```

### Step 3: サービスの実装

`src/files/files.service.ts` を開き、以下のコードを追加:

```tsx
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FilesService {
  private files: File[] = [];
  private readonly uploadPath = 'uploads';

  async create(
    createFileDto: CreateFileDto,
    file: Express.Multer.File,
  ): Promise<File> {
    // アップロードディレクトリの存在確認と作成
    await fs.mkdir(this.uploadPath, { recursive: true });

    const newFile: File = {
      id: this.files.length + 1,
      originalName: file.originalname,
      fileName: file.filename,
      description: createFileDto.description,
      path: path.join(this.uploadPath, file.filename),
      mimeType: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
    };

    this.files.push(newFile);
    return newFile;
  }

  findAll(): File[] {
    return this.files;
  }

  findOne(id: number): File {
    const file = this.files.find((file) => file.id === id);
    if (!file) {
      throw new NotFoundException(`ファイルID ${id} が見つかりません`);
    }
    return file;
  }

  async update(id: number, updateFileDto: UpdateFileDto): Promise<File> {
    const file = this.findOne(id);
    Object.assign(file, {
      ...updateFileDto,
      updatedAt: new Date(),
    });
    await fs.writeFile(
      path.join(this.uploadPath, 'metadata.json'),
      JSON.stringify(this.files),
    );
    return file;
  }

  async remove(id: number): Promise<void> {
    const file = this.findOne(id);
    await fs.unlink(file.path);
    this.files = this.files.filter((f) => f.id !== id);
  }
}
```

### Step 4: コントローラーの実装

`src/files/files.controller.ts` を開き、以下のコードを追加:

```tsx
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() createFileDto: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.create(createFileDto, file);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return this.filesService.update(id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}
```

### Step 5: モジュールの設定

`src/files/files.module.ts` を開き、以下のコードを追加:

```tsx
import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
```

### Step 6: アプリケーションの起動と動作確認

1. サーバーを起動:

```bash
npm run start:dev

```

1. APIのテスト:

```bash
# ファイルをアップロード（テキストファイルの例）
curl -X POST <http://localhost:3000/files> \\
  -F "file=@./test.txt" \\
  -F "description=テストファイル"

# ファイル一覧を取得
curl <http://localhost:3000/files>

# 特定のファイル情報を取得
curl <http://localhost:3000/files/1>

# ファイル情報を更新
curl -X PATCH <http://localhost:3000/files/1> \\
  -H "Content-Type: application/json" \\
  -d '{"description": "更新された説明"}'

# ファイルを削除
curl -X DELETE <http://localhost:3000/files/1>

```

powershell

```powershell
PS C:\Users\kazum\tutorial\nest\controller\file-management-api> "これはテストファイルです" | Out-File -Path "./test.txt" -Encoding utf8
PS C:\Users\kazum\tutorial\nest\controller\file-management-api> Get-Item "./test.txt"

    Directory: C:\Users\kazum\tutorial\nest\controller\file-management-api

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---          2025/02/21    12:53             38 test.txt

PS C:\Users\kazum\tutorial\nest\controller\file-management-api> Invoke-RestMethod -Method Post -Uri "http://localhost:3000/files" -Form @{
>>     file = Get-Item "./test.txt"
>>     description = "テストファイル"
>> }

id           : 1
originalName : test.txt
fileName     : 1740110003871-923407648.txt
description  : テストファイル
path         : uploads\1740110003871-923407648.txt
mimeType     : application/octet-stream
size         : 38
uploadedAt   : 2025/02/21 3:53:23

PS C:\Users\kazum\tutorial\nest\controller\file-management-api> Invoke-RestMethod -Method Get -Uri "http://localhost:3000/files"

id           : 1
originalName : test.txt
fileName     : 1740110003871-923407648.txt
description  : テストファイル
path         : uploads\1740110003871-923407648.txt
mimeType     : application/octet-stream
size         : 38
uploadedAt   : 2025/02/21 3:53:23

PS C:\Users\kazum\tutorial\nest\controller\file-management-api> Invoke-RestMethod -Method Get -Uri "http://localhost:3000/files/1"

id           : 1
originalName : test.txt
fileName     : 1740110003871-923407648.txt
description  : テストファイル
path         : uploads\1740110003871-923407648.txt
mimeType     : application/octet-stream
size         : 38
uploadedAt   : 2025/02/21 3:53:23

PS C:\Users\kazum\tutorial\nest\controller\file-management-api>
PS C:\Users\kazum\tutorial\nest\controller\file-management-api>
PS C:\Users\kazum\tutorial\nest\controller\file-management-api> $body = @{
>>     description = "更新された説明"
>> } | ConvertTo-Json
>>
>> Invoke-RestMethod -Method Patch -Uri "http://localhost:3000/files/1" `
>>     -ContentType "application/json" `
>>     -Body $body

id           : 1
originalName : test.txt
fileName     : 1740110003871-923407648.txt
description  : 更新された説明
path         : uploads\1740110003871-923407648.txt
mimeType     : application/octet-stream
size         : 38
uploadedAt   : 2025/02/21 3:53:23
updatedAt    : 2025/02/21 3:54:04

PS C:\Users\kazum\tutorial\nest\controller\file-management-api>
PS C:\Users\kazum\tutorial\nest\controller\file-management-api>
PS C:\Users\kazum\tutorial\nest\controller\file-management-api> Invoke-RestMethod -Method Get -Uri "http://localhost:3000/files"

id           : 1
originalName : test.txt
fileName     : 1740110003871-923407648.txt
description  : 更新された説明
path         : uploads\1740110003871-923407648.txt
mimeType     : application/octet-stream
size         : 38
uploadedAt   : 2025/02/21 3:53:23
updatedAt    : 2025/02/21 3:54:04

PS C:\Users\kazum\tutorial\nest\controller\file-management-api> Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/files/1"

PS C:\Users\kazum\tutorial\nest\controller\file-management-api>
```

## チェックポイント

- [ ] アップロードフォルダが正しく作成されている
- [ ] ファイルのアップロードができる
- [ ] アップロードしたファイルの情報が取得できる
- [ ] ファイル情報の更新ができる
- [ ] ファイルの削除ができる（ストレージからも削除される）

## トラブルシューティング

### エラー1: アップロードフォルダが見つからない

```
ENOENT: no such file or directory, open 'uploads/...'

```

解決方法:

1. プロジェクトルートに `uploads` フォルダが作成されているか確認
2. フォルダのパーミッションが正しく設定されているか確認

### エラー2: ファイルサイズ制限エラー

```
File too large

```

解決方法:

1. `main.ts` に以下の設定を追加:

```tsx
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true, limit: '50mb' }));
```

## 補足情報

- このAPIではファイルをローカルストレージに保存しています
- 実運用では以下の機能を追加することをお勧めします：
  1. ファイルタイプの制限
  2. ファイルサイズの制限
  3. クラウドストレージの利用
  4. セキュリティ対策（アクセス制御など）
