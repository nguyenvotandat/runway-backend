import { ProductEntity } from '../entities/product.entity';

// DTO khớp với Prisma Schema
export interface CreateProductData {
  name: string;
  slug: string;
  brandId: string;          // Foreign key to Brand
  categoryId: string;       // Foreign key to Category
  description?: string;
  glbUrl?: string;
  // Images và variants sẽ được tạo riêng
}

export interface UpdateProductData {
  name?: string;
  slug?: string;
  brandId?: string;
  categoryId?: string;
  description?: string;
  glbUrl?: string;
}

export interface ProductFilter {
  categoryId?: string;
  brandId?: string;         // Đổi từ 'brand' thành 'brandId'
  search?: string;
  minPrice?: number;        // Filter qua ProductVariant.prices
  maxPrice?: number;
  colorId?: string;         // Filter qua ProductVariant.colorId
  sizeId?: string;          // Filter qua ProductVariant.sizeId
  inStock?: boolean;        // Filter qua Inventory.quantity > 0
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export abstract class ProductRepositoryInterface {
  abstract create(data: CreateProductData): Promise<ProductEntity>;
  
  abstract findAll(
    filter: ProductFilter,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ProductEntity>>;
  
  abstract findById(id: string): Promise<ProductEntity | null>;
  
  abstract findBySlug(slug: string): Promise<ProductEntity | null>;
  
  abstract update(id: string, data: UpdateProductData): Promise<ProductEntity>;
  
  abstract delete(id: string): Promise<void>;
  
  // E-commerce specific methods
  abstract findByCategory(categoryId: string): Promise<ProductEntity[]>;
  
  abstract findByBrand(brandId: string): Promise<ProductEntity[]>;
  
  abstract findFeatured(limit?: number): Promise<ProductEntity[]>;
  
  abstract search(query: string, limit?: number): Promise<ProductEntity[]>;
}

// Symbol for dependency injection
export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
