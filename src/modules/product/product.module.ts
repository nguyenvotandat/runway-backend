import { Module } from '@nestjs/common';
import { ProductController } from './presentation/product.controller';
import { ProductService } from './application/product.service';
import { ProductRepositoryInterface } from './domain/interfaces/product.repository.interface';
import { ProductPrismaRepository } from './infrastructure/product.prisma.repository';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    {
      provide: ProductRepositoryInterface,
      useClass: ProductPrismaRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
