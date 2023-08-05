import { Injectable } from '@nestjs/common';
import { CRUDRepository } from '@project/util/util-types';
import { PrismaService } from '../prisma/prisma.service';
import { TaskEntity } from './task.entity';
import { ITask } from '@project/shared/app-types';

@Injectable()
export class TaskRepository
  implements CRUDRepository<TaskEntity, number, ITask>
{
  constructor(private readonly prisma: PrismaService) {}

  public async create(item: TaskEntity): Promise<ITask> {
    const entityData = item.toObject();
    return await this.prisma.task.create({
      data: {
        ...entityData,
        comments: {
          connect: [],
        },
        category: {
          connectOrCreate: {
            where: {
              name: entityData.category.name,
            },
            create: {
              name: entityData.category.name,
            },
          },
        },
        tags: {
          connect: entityData.tags.map((tag) => ({
            tagId: tag.tagId,
          })),
        },
      },
      include: {
        comments: true,
        tags: true,
        category: true,
      },
    });
  }

  public async destroy(taskId: number): Promise<void> {
    await this.prisma.task.delete({
      where: {
        taskId,
      },
    });
  }

  public async findById(taskId: number): Promise<ITask | null> {
    return this.prisma.task.findFirst({
      where: {
        taskId,
      },
      include: {
        comments: true,
        category: true,
        tags: true,
      },
    });
  }

  public async find(): Promise<ITask[]> {
    return await this.prisma.task.findMany({
      include: {
        comments: true,
        category: true,
      },
    });
  }

  public async update(_id: number, _item: TaskEntity): Promise<ITask> {
    return Promise.resolve(undefined);
  }
}
