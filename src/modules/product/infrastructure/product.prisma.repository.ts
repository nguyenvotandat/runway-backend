import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { 
  ProductRepositoryInterface,
  CreateProductData,
  UpdateProductData,
  ProductFilter,
  PaginatedResult 
} from '../domain/interfaces/product.repository.interface';
import { ProductEntity } from '../domain/entities/product.entity';
import { ProductVariantEntity } from '../domain/entities/product-variant.entity';
import { BrandEntity } from '../domain/entities/brand.entity';
import { CategoryEntity } from '../domain/entities/category.entity';
import { ColorEntity } from '../domain/entities/color.entity';
import { SizeEntity } from '../domain/entities/size.entity';
import { PriceEntity } from '../domain/entities/price.entity';
import { InventoryEntity } from '../domain/entities/inventory.entity';
import { ProductImage } from '../domain/value-objects/product-image.vo';
import { ProductReview } from '../domain/value-objects/product-review.vo';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductPrismaRepository implements ProductRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductData): Promise<ProductEntity> {
    const product = await this.prisma.product.create({
      data: {
        id: randomUUID(),
        name: data.name,
        slug: data.slug,
        brandId: data.brandId,
        categoryId: data.categoryId,
        description: data.description,
        glbUrl: data.glbUrl,
        updatedAt: new Date(),
      },
      include: this.getIncludeOptions(),
    });

    return this.toDomainEntity(product);
  }

  async findAll(
    filter: ProductFilter,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ProductEntity>> {
    const skip = (page - 1) * limit;
    
    // Build dynamic where conditions
    const where = this.buildWhereConditions(filter);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: this.getIncludeOptions(),
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map(p => this.toDomainEntity(p)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        ...this.getIncludeOptions(),
        // Thêm review cho detail view
        // review: {
        //   include: {
        //     user: {
        //       select: { id: true, name: true } // Exclude password
        //     }
        //   },
        //   orderBy: { createdAt: 'desc' },
        //   take: 10 // Limit review
        // }
      },
    });

    return product ? this.toDomainEntity(product) : null;
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: this.getIncludeOptions(),
    });

    return product ? this.toDomainEntity(product) : null;
  }

  async update(id: string, data: UpdateProductData): Promise<ProductEntity> {
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.brandId && { brandId: data.brandId }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.glbUrl !== undefined && { glbUrl: data.glbUrl }),
      },
      include: this.getIncludeOptions(),
    });

    return this.toDomainEntity(product);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async findByCategory(categoryId: string): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: this.getIncludeOptions(),
      orderBy: { createdAt: 'desc' },
    });

    return products.map(p => this.toDomainEntity(p));
  }

  async findByBrand(brandId: string): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: { brandId },
      include: this.getIncludeOptions(),
      orderBy: { createdAt: 'desc' },
    });

    return products.map(p => this.toDomainEntity(p));
  }

  async findFeatured(limit: number = 10): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: {
        ratingAverage: { gte: 4.0 }, // Sản phẩm có rating >= 4.0
      },
      include: this.getIncludeOptions(),
      orderBy: [
        { ratingAverage: 'desc' },
        { ratingCount: 'desc' },
      ],
      take: limit,
    });

    return products.map(p => this.toDomainEntity(p));
  }

  async search(query: string, limit: number = 20): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { brand: { name: { contains: query } } },
          { category: { name: { contains: query } } },
        ],
      },
      include: this.getIncludeOptions(),
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return products.map(p => this.toDomainEntity(p));
  }

  // Helper methods
  private getIncludeOptions() {
    return {
      brand: {
        select: { id: true, name: true }
      },
      category: {
        select: { id: true, name: true, slug: true }
      },
      productimage: {
        orderBy: { sortOrder: 'asc' },
        select: { id: true, url: true, sortOrder: true }
      },
      productvariant: {
        include: {
          color: {
            select: { id: true, name: true, hex: true }
          },
          size: {
            select: { id: true, label: true }
          },
          inventory: {
            select: { quantity: true, safetyStock: true, updatedAt: true } // ← Thêm updatedAt
          },
          price: {
            where: { validTo: null }, // Chỉ lấy giá hiện tại
            orderBy: { validFrom: 'desc' },
            take: 1,
            select: { amount: true, currency: true }
          }
        }
      }
    } as const;
  }

  private buildWhereConditions(filter: ProductFilter) {
    const where: any = {};

    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }

    if (filter.brandId) {
      where.brandId = filter.brandId;
    }

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search } },
        { description: { contains: filter.search } },
      ];
    }

    if (filter.inStock) {
      where.variants = {
        some: {
          inventory: {
            quantity: { gt: 0 }
          }
        }
      };
    }

    if (filter.colorId) {
      where.variants = {
        some: {
          colorId: filter.colorId
        }
      };
    }

    if (filter.sizeId) {
      where.variants = {
        some: {
          sizeId: filter.sizeId
        }
      };
    }

    if (filter.minPrice || filter.maxPrice) {
      const priceFilter: any = {};
      if (filter.minPrice) priceFilter.gte = filter.minPrice;
      if (filter.maxPrice) priceFilter.lte = filter.maxPrice;

      where.variants = {
        some: {
          prices: {
            some: {
              AND: [
                { validTo: null },
                { amount: priceFilter }
              ]
            }
          }
        }
      };
    }

    return where;
  }

  private toDomainEntity(data: any): ProductEntity {
    // Map brand
    const brand = data.brand ? new BrandEntity(
      data.brand.id,
      data.brand.name,
      data.brand.createdAt,
      data.brand.updatedAt,
    ) : undefined;

    // Map category
    const category = data.category ? new CategoryEntity(
      data.category.id,
      data.category.name,
      data.category.slug,
      data.category.createdAt,
      data.category.updatedAt,
    ) : undefined;

    // Map images to value objects
    const images = data.productimage?.map((img: any) => 
      new ProductImage(img.id, img.url, img.sortOrder)
    ) || [];

    // Map reviews to value objects
    const reviews: ProductReview[] = []; // TODO: Fix review mapping
    // const reviews = data.reviews?.map((review: any) => 
    //   new ProductReview(
    //     review.rating,
    //     review.comment,
    //     review.user?.name,
    //     review.createdAt,
    //   )
    // ) || [];

    // Map variants with proper entities
    const variants = data.productvariant?.map((variant: any) => {
      // Map color
      const color = variant.color ? new ColorEntity(
        variant.color.id,
        variant.color.name,
        variant.color.hex,
      ) : undefined;

      // Map size
      const size = variant.size ? new SizeEntity(
        variant.size.id,
        variant.size.label,
      ) : undefined;

      // Map inventory
      const inventory = variant.inventory ? new InventoryEntity(
        variant.id,
        variant.inventory.quantity,
        variant.inventory.safetyStock,
        variant.inventory.updatedAt,
      ) : undefined;

      // Map prices
      const prices = variant.price?.map((price: any) => 
        new PriceEntity(
          price.id || `${variant.id}-price`,
          variant.id,
          price.amount,
          price.currency,
          price.validFrom || new Date(),
          price.discount,
          price.validTo,
        )
      ) || [];

      return new ProductVariantEntity(
        variant.id,
        data.id,
        variant.colorId,
        variant.sizeId,
        variant.sku,
        'ACTIVE',
        variant.createdAt,
        variant.updatedAt,
        color,
        size,
        inventory,
        prices,
      );
    }) || [];

    return new ProductEntity(
      data.id,
      data.name,
      data.slug,
      data.brandId,
      data.categoryId,
      data.description,
      data.glbUrl,
      data.ratingAverage?.toNumber(),
      data.ratingCount,
      data.createdAt,
      data.updatedAt,
      brand,
      category,
      variants,
      images,
      reviews,
    );
  }
}
