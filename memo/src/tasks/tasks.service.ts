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
