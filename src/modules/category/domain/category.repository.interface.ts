import { CategoryEntity } from './category.entity';

export interface CreateCategoryData {
  name: string;
  slug: string;
}

export abstract class CategoryRepositoryInterface {
  abstract create(data: CreateCategoryData): Promise<CategoryEntity>;
  abstract findAll(): Promise<CategoryEntity[]>;
  abstract findById(id: string): Promise<CategoryEntity | null>;
  abstract findByName(name: string): Promise<CategoryEntity | null>;
  abstract update(id: string, data: Partial<CategoryEntity>): Promise<CategoryEntity>;
  abstract delete(id: string): Promise<void>;
}
