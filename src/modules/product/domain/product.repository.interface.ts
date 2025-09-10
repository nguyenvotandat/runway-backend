import { ProductEntity } from './product.entity';

export interface CreateProductData {
  name: string;
  brand: string;
  price: number;
  categoryId: string;
  glbUrl?: string;
  images?: { url: string }[];
  colors?: { name: string; hex: string }[];
}

export interface ProductFilter {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export abstract class ProductRepositoryInterface {
  abstract create(data: CreateProductData): Promise<ProductEntity>;
  abstract findAll(
    filter: ProductFilter,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ProductEntity>>;
  abstract findById(id: string): Promise<ProductEntity | null>;
  abstract update(id: string, data: Partial<CreateProductData>): Promise<ProductEntity>;
  abstract delete(id: string): Promise<void>;
}
