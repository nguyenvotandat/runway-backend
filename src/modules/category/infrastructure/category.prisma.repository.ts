import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CategoryRepositoryInterface, CreateCategoryData } from '../domain/category.repository.interface';
import { CategoryEntity } from '../domain/category.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoryPrismaRepository implements CategoryRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryData): Promise<CategoryEntity> {
    const category = await this.prisma.category.create({
      data: {
        id: randomUUID(),
        name: data.name,
        slug: data.slug,
        updatedAt: new Date(),
      },
    });

    return new CategoryEntity(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return categories.map(category => new CategoryEntity(category));
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    return category ? new CategoryEntity(category) : null;
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({
      where: { name },
    });

    return category ? new CategoryEntity(category) : null;
  }

  async update(id: string, data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const category = await this.prisma.category.update({
      where: { id },
      data,
    });

    return new CategoryEntity(category);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
