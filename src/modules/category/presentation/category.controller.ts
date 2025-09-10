import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from '../application/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const result = await this.categoryService.create(createCategoryDto);
    return BaseResponseDto.success(result, 'Tạo danh mục thành công');
  }

  @Public()
  @Get()
  async findAll() {
    const result = await this.categoryService.findAll();
    return BaseResponseDto.success(result);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.categoryService.findById(id);
    return BaseResponseDto.success(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const result = await this.categoryService.update(id, updateCategoryDto);
    return BaseResponseDto.success(result, 'Cập nhật danh mục thành công');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.categoryService.delete(id);
    return BaseResponseDto.success(null, 'Xóa danh mục thành công');
  }
}
