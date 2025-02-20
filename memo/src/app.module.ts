import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemosModule } from './memos/memos.module';

@Module({
  imports: [MemosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
