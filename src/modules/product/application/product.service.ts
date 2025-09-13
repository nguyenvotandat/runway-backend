import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepositoryInterface, ProductFilter } from '../domain/interfaces/product.repository.interface';
import { ProductEntity } from '../domain/entities/product.entity';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from '../presentation/product.dto';
import { PaginatedResponseDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productRepository.create(createProductDto);
  }

  async findAll(
    filterDto: ProductFilterDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<ProductEntity>> {
    const filter: ProductFilter = {
      categoryId: filterDto.categoryId,
      brandId: filterDto.brandId,
      minPrice: filterDto.minPrice,
      maxPrice: filterDto.maxPrice,
      search: filterDto.search,
    };

    const result = await this.productRepository.findAll(filter, page, limit);
    
    return new PaginatedResponseDto(
      result.data,
      result.total,
      page,
      limit,
    );
  }

  async findById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    return this.productRepository.update(id, updateProductDto);
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    return this.productRepository.delete(id);
  }
}
