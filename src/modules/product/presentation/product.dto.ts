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

  @IsString({ message: 'Slug phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Slug không được để trống' })
  slug: string;

  @IsString({ message: 'ID thương hiệu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'ID thương hiệu không được để trống' })
  brandId: string;

  @IsString({ message: 'ID danh mục phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'ID danh mục không được để trống' })
  categoryId: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL model 3D không hợp lệ' })
  glbUrl?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Slug phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Slug không được để trống' })
  slug?: string;

  @IsOptional()
  @IsString({ message: 'ID thương hiệu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'ID thương hiệu không được để trống' })
  brandId?: string;

  @IsOptional()
  @IsString({ message: 'ID danh mục phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'ID danh mục không được để trống' })
  categoryId?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL model 3D không hợp lệ' })
  glbUrl?: string;
}

export class ProductFilterDto {
  @IsOptional()
  @IsString({ message: 'ID danh mục phải là chuỗi ký tự' })
  categoryId?: string;

  @IsOptional()
  @IsString({ message: 'ID thương hiệu phải là chuỗi ký tự' })
  brandId?: string;

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
