import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CategoryRepositoryInterface } from '../domain/category.repository.interface';
import { CategoryEntity } from '../domain/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../presentation/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const { name } = createCategoryDto;

    // Check if category already exists
    const existingCategory = await this.categoryRepository.findByName(name);
    if (existingCategory) {
      throw new ConflictException('Danh mục đã tồn tại');
    }

    // Generate slug from name
    const slug = this.generateSlug(name);

    return this.categoryRepository.create({ name, slug });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD') // Normalize Vietnamese characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[đĐ]/g, 'd') // Handle Vietnamese 'd' character
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
      .trim()
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll();
  }

  async findById(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    // Check if new name conflicts with existing category
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findByName(updateCategoryDto.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Tên danh mục đã tồn tại');
      }
    }

    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return this.categoryRepository.delete(id);
  }
}
