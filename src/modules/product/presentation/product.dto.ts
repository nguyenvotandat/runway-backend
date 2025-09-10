import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsArray,
  ValidateNested,
  IsHexColor,
  Min,
} from 'class-validator';

export class ProductImageDto {
  @IsUrl({}, { message: 'URL hình ảnh không hợp lệ' })
  url: string;
}

export class ProductColorDto {
  @IsString({ message: 'Tên màu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên màu không được để trống' })
  name: string;

  @IsHexColor({ message: 'Mã màu hex không hợp lệ' })
  hex: string;
}

export class CreateProductDto {
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @IsString({ message: 'Thương hiệu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Thương hiệu không được để trống' })
  brand: string;

  @IsNumber({}, { message: 'Giá phải là số' })
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  price: number;

  @IsString({ message: 'ID danh mục phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'ID danh mục không được để trống' })
  categoryId: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL model 3D không hợp lệ' })
  glbUrl?: string;

  @IsOptional()
  @IsArray({ message: 'Hình ảnh phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @IsOptional()
  @IsArray({ message: 'Màu sắc phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => ProductColorDto)
  colors?: ProductColorDto[];
}

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Thương hiệu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Thương hiệu không được để trống' })
  brand?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Giá phải là số' })
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'ID danh mục phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'ID danh mục không được để trống' })
  categoryId?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL model 3D không hợp lệ' })
  glbUrl?: string;

  @IsOptional()
  @IsArray({ message: 'Hình ảnh phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @IsOptional()
  @IsArray({ message: 'Màu sắc phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => ProductColorDto)
  colors?: ProductColorDto[];
}

export class ProductFilterDto {
  @IsOptional()
  @IsString({ message: 'ID danh mục phải là chuỗi ký tự' })
  categoryId?: string;

  @IsOptional()
  @IsString({ message: 'Thương hiệu phải là chuỗi ký tự' })
  brand?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Giá tối thiểu phải là số' })
  @Min(0, { message: 'Giá tối thiểu phải lớn hơn hoặc bằng 0' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Giá tối đa phải là số' })
  @Min(0, { message: 'Giá tối đa phải lớn hơn hoặc bằng 0' })
  maxPrice?: number;

  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  search?: string;
}
