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
