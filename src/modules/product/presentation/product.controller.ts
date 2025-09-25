import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductService } from '../application/product.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto';
import { ProductFilter } from '../domain/interfaces/product.repository.interface';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const result = await this.productService.create(createProductDto);
    return BaseResponseDto.success(result, 'Tạo sản phẩm thành công');
  }

  @Public()
  @Get()
  async findAll(
    @Query() queryDto: ProductQueryDto,
  ) {
    const { page, limit, categoryId, brandId, minPrice, maxPrice, search } = queryDto;
  
    // ✅ Map DTO sang Domain Filter thay vì truyền filterParams trực tiếp
    const filter: ProductFilter = {
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      search,
    };
  
    const result = await this.productService.findAll(
      filter,
      page || 1,
      limit || 10,
    );
    return BaseResponseDto.success(result);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.productService.findById(id);
    return BaseResponseDto.success(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const result = await this.productService.update(id, updateProductDto);
    return BaseResponseDto.success(result, 'Cập nhật sản phẩm thành công');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.productService.delete(id);
    return BaseResponseDto.success(null, 'Xóa sản phẩm thành công');
  }
}
