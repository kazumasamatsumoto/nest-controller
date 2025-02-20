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
