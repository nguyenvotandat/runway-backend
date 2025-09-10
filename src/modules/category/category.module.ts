import { Module } from '@nestjs/common';
import { CategoryController } from './presentation/category.controller';
import { CategoryService } from './application/category.service';
import { CategoryRepositoryInterface } from './domain/category.repository.interface';
import { CategoryPrismaRepository } from './infrastructure/category.prisma.repository';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    PrismaService,
    {
      provide: CategoryRepositoryInterface,
      useClass: CategoryPrismaRepository,
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
