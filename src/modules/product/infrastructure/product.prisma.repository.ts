import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import {
  ProductRepositoryInterface,
  CreateProductData,
  ProductFilter,
  PaginatedResult,
} from '../domain/product.repository.interface';
import { ProductEntity, ProductImageEntity, ProductColorEntity } from '../domain/product.entity';

@Injectable()
export class ProductPrismaRepository implements ProductRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductData): Promise<ProductEntity> {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        brand: data.brand,
        price: new Decimal(data.price),
        categoryId: data.categoryId,
        glbUrl: data.glbUrl,
        images: data.images ? {
          create: data.images,
        } : undefined,
        colors: data.colors ? {
          create: data.colors,
        } : undefined,
      },
      include: {
        images: true,
        colors: true,
        category: true,
      },
    });

    return this.mapToEntity(product);
  }

  async findAll(
    filter: ProductFilter,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ProductEntity>> {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }
    
    if (filter.brand) {
      where.brand = {
        contains: filter.brand,
        mode: 'insensitive',
      };
    }
    
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      where.price = {};
      if (filter.minPrice !== undefined) {
        where.price.gte = new Decimal(filter.minPrice);
      }
      if (filter.maxPrice !== undefined) {
        where.price.lte = new Decimal(filter.maxPrice);
      }
    }
    
    if (filter.search) {
      where.OR = [
        {
          name: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
        {
          brand: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: true,
          colors: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map(product => this.mapToEntity(product)),
      total,
    };
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        colors: true,
        category: true,
      },
    });

    return product ? this.mapToEntity(product) : null;
  }

  async update(id: string, data: Partial<CreateProductData>): Promise<ProductEntity> {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.price !== undefined) updateData.price = new Decimal(data.price);
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.glbUrl !== undefined) updateData.glbUrl = data.glbUrl;

    // Handle images update
    if (data.images !== undefined) {
      updateData.images = {
        deleteMany: {},
        create: data.images,
      };
    }

    // Handle colors update
    if (data.colors !== undefined) {
      updateData.colors = {
        deleteMany: {},
        create: data.colors,
      };
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        colors: true,
        category: true,
      },
    });

    return this.mapToEntity(product);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  private mapToEntity(product: any): ProductEntity {
    return new ProductEntity({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price.toNumber(),
      categoryId: product.categoryId,
      glbUrl: product.glbUrl,
      createdAt: product.createdAt,
      images: product.images?.map((img: any) => new ProductImageEntity({
        id: img.id,
        url: img.url,
        productId: img.productId,
      })) || [],
      colors: product.colors?.map((color: any) => new ProductColorEntity({
        id: color.id,
        name: color.name,
        hex: color.hex,
        productId: color.productId,
      })) || [],
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
      } : undefined,
    });
  }
}
