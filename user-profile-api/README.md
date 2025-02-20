# ユーザープロフィールAPI構築チュートリアル

## 目的

- 複数のコントローラーを作成し、それらの関係を理解する
- 基本的なCRUD操作の実装方法を学ぶ
- NestJSのモジュール構造を理解する

## 実装手順

### Step 1: プロジェクトのセットアップ

```bash
# プロジェクトフォルダを作成
nest new user-profile-api
cd user-profile-api

# 必要なモジュールを生成
nest generate module users
nest generate module profiles
nest generate controller users
nest generate controller profiles
nest generate service users
nest generate service profiles

# インターフェース用のフォルダを作成
mkdir src/users/interfaces
mkdir src/profiles/interfaces

# インターフェースファイルを作成
touch src/users/interfaces/user.interface.ts
touch src/profiles/interfaces/profile.interface.ts

```

powershell

```powershell
# インターフェースファイルを作成
New-Item -ItemType File -Path "src/users/interfaces/user.interface.ts" -Force
New-Item -ItemType File -Path "src/profiles/interfaces/profile.interface.ts" -Force
```

作成後のフォルダ構造:

```
src/
├── app.module.ts
├── users/
│   ├── interfaces/
│   │   └── user.interface.ts
│   ├── users.module.ts
│   ├── users.controller.ts
│   └── users.service.ts
└── profiles/
    ├── interfaces/
    │   └── profile.interface.ts
    ├── profiles.module.ts
    ├── profiles.controller.ts
    └── profiles.service.ts

```

### Step 2: インターフェースの実装

1. `src/users/interfaces/user.interface.ts` を開き、以下のコードを追加:

```tsx
export interface User {
  id: number;
  username: string;
  email: string;
}
```

1. `src/profiles/interfaces/profile.interface.ts` を開き、以下のコードを追加:

```tsx
export interface Profile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  bio: string;
}
```

### Step 3: サービスの実装

1. `src/users/users.service.ts` を開き、以下のコードを追加:

```tsx
import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(user: User): User {
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    return this.users.find((user) => user.id === id);
  }
}
```

1. `src/profiles/profiles.service.ts` を開き、以下のコードを追加:

```tsx
import { Injectable } from '@nestjs/common';
import { Profile } from './interfaces/profile.interface';

@Injectable()
export class ProfilesService {
  private profiles: Profile[] = [];

  create(profile: Profile): Profile {
    this.profiles.push(profile);
    return profile;
  }

  findByUserId(userId: number): Profile {
    return this.profiles.find((profile) => profile.userId === userId);
  }
}
```

### Step 4: コントローラーの実装

1. `src/users/users.controller.ts` を開き、以下のコードを追加:

```tsx
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(user: User): User {
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`ユーザーID: ${id} が見つかりません`);
    }
    return user;
  }
}
```

1. `src/profiles/profiles.controller.ts` を開き、以下のコードを追加:

```tsx
import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from './interfaces/profile.interface';

@Injectable()
export class ProfilesService {
  private profiles: Profile[] = [];

  create(profile: Profile): Profile {
    this.profiles.push(profile);
    return profile;
  }

  findByUserId(userId: number): Profile {
    const profile = this.profiles.find((profile) => profile.userId === userId);
    if (!profile) {
      throw new NotFoundException(
        `ユーザーID: ${userId} のプロフィールが見つかりません`,
      );
    }
    return profile;
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
# ユーザーを作成
curl -X POST <http://localhost:3000/users> -H "Content-Type: application/json" -d '{"id": 1, "username": "test", "email": "test@example.com"}'

# プロフィールを作成
curl -X POST <http://localhost:3000/profiles> -H "Content-Type: application/json" -d '{"id": 1, "userId": 1, "firstName": "Test", "lastName": "User", "bio": "Hello!"}'

# ユーザーの取得
curl <http://localhost:3000/users/1>

# プロフィールの取得
curl <http://localhost:3000/profiles/user/1>

```

powershell

````powershell

1. ユーザーを作成:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/users" `
-Method POST `
-Headers @{"Content-Type"="application/json"} `
-Body '{"id": 1, "username": "test", "email": "test@example.com"}'
````

2. プロフィールを作成:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/profiles" `
-Method POST `
-Headers @{"Content-Type"="application/json"} `
-Body '{"id": 1, "userId": 1, "firstName": "Test", "lastName": "User", "bio": "Hello!"}'
```

3. ユーザーの取得:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/users/1"
```

4. プロフィールの取得:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/profiles/user/1"
```

````

```powershell
実行結果
PS C:\Users\kazum\tutorial\nest\controller> Invoke-WebRequest -Uri "http://localhost:3000/users" `
>> -Method POST `
>> -Headers @{"Content-Type"="application/json"} `
>> -Body '{"id": 1, "username": "test", "email": "test@example.com"}'

StatusCode        : 201
StatusDescription : Created
Content           : {"id":1,"username":"test","email":"test@example.com"}
RawContent        : HTTP/1.1 201 Created
                    X-Powered-By: Express
                    ETag: W/"35-LVO8HB31V0P83FxvvzCWOVNbzOc"
                    Date: Thu, 20 Feb 2025 11:19:14 GMT
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Type: application/jso…
Headers           : {[X-Powered-By, System.String[]], [ETag, System.String[]], [Date, System.String[]], [Connection, System.St
                    ring[]]…}
Images            : {}
InputFields       : {}
Links             : {}
RawContentLength  : 53
RelationLink      : {}

PS C:\Users\kazum\tutorial\nest\controller>
PS C:\Users\kazum\tutorial\nest\controller>
PS C:\Users\kazum\tutorial\nest\controller>
PS C:\Users\kazum\tutorial\nest\controller> Invoke-WebRequest -Uri "http://localhost:3000/profiles" `
>> -Method POST `
>> -Headers @{"Content-Type"="application/json"} `
>> -Body '{"id": 1, "userId": 1, "firstName": "Test", "lastName": "User", "bio": "Hello!"}'

StatusCode        : 201
StatusDescription : Created
Content           : {"id":1,"userId":1,"firstName":"Test","lastName":"User","bio":"Hello!"}
RawContent        : HTTP/1.1 201 Created
                    X-Powered-By: Express
                    ETag: W/"47-vDPhfQenz+JD7EG16Jfs+/mqhxk"
                    Date: Thu, 20 Feb 2025 11:19:21 GMT
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Type: application/jso…
Headers           : {[X-Powered-By, System.String[]], [ETag, System.String[]], [Date, System.String[]], [Connection, System.St
                    ring[]]…}
Images            : {}
InputFields       : {}
Links             : {}
RawContentLength  : 71
RelationLink      : {}

PS C:\Users\kazum\tutorial\nest\controller>
PS C:\Users\kazum\tutorial\nest\controller>
PS C:\Users\kazum\tutorial\nest\controller>
PS C:\Users\kazum\tutorial\nest\controller> Invoke-WebRequest -Uri "http://localhost:3000/users/1"

StatusCode        : 200
StatusDescription : OK
Content           : {"id":1,"username":"test","email":"test@example.com"}
RawContent        : HTTP/1.1 200 OK
                    X-Powered-By: Express
                    ETag: W/"35-LVO8HB31V0P83FxvvzCWOVNbzOc"
                    Date: Thu, 20 Feb 2025 11:19:29 GMT
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Type: application/json; ch…
Headers           : {[X-Powered-By, System.String[]], [ETag, System.String[]], [Date, System.String[]], [Connection, System.St
                    ring[]]…}
Images            : {}
InputFields       : {}
Links             : {}
RawContentLength  : 53
RelationLink      : {}

PS C:\Users\kazum\tutorial\nest\controller> Invoke-WebRequest -Uri "http://localhost:3000/profiles/user/1"

StatusCode        : 200
StatusDescription : OK
Content           : {"id":1,"userId":1,"firstName":"Test","lastName":"User","bio":"Hello!"}
RawContent        : HTTP/1.1 200 OK
                    X-Powered-By: Express
                    ETag: W/"47-vDPhfQenz+JD7EG16Jfs+/mqhxk"
                    Date: Thu, 20 Feb 2025 11:19:37 GMT
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Type: application/json; ch…
Headers           : {[X-Powered-By, System.String[]], [ETag, System.String[]], [Date, System.String[]], [Connection, System.St
                    ring[]]…}
Images            : {}
InputFields       : {}
Links             : {}
RawContentLength  : 71
RelationLink      : {}

PS C:\Users\kazum\tutorial\nest\controller>
````

## チェックポイント

- [ ] すべてのファイルが正しく作成されている
- [ ] サーバーが正常に起動する
- [ ] ユーザーの作成と取得ができる
- [ ] プロフィールの作成と取得ができる

## トラブルシューティング

### エラー1: モジュールが見つからない

```
Error: Cannot find module './users/users.service'

```

解決方法:

1. `src/app.module.ts` を開き、以下のように修正されているか確認:

```tsx
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [UsersModule, ProfilesModule],
})
export class AppModule {}
```

### エラー2: 型エラー

```
Type '{ name: string; }' is missing the following properties from type 'User'

```

解決方法:

1. リクエストボディに必要な全てのプロパティ（id, username, email）が含まれているか確認
2. TypeScriptの型定義が正しいか確認

## 補足情報

- このチュートリアルではメモリ内の配列をデータストアとして使用しています
- アプリケーションを再起動すると、データは失われます
- 実際のアプリケーションでは、データベースを使用することをお勧めします

次のステップとして以下の機能を追加してみましょう：

1. バリデーション処理の追加
2. エラーハンドリングの実装
3. データベース連携の実装
