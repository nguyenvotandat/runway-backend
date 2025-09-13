// Import các entities và value objects
import { ProductVariantEntity } from './product-variant.entity';
import { BrandEntity } from './brand.entity';
import { CategoryEntity } from './category.entity';
import { ProductImage } from '../value-objects/product-image.vo';
import { ProductReview } from '../value-objects/product-review.vo';
import { ColorEntity } from './color.entity';
import { SizeEntity } from './size.entity';

// Entity khớp với Prisma Schema
export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly brandId: string,
    public readonly categoryId: string,
    public readonly description?: string,
    public readonly glbUrl?: string,
    public readonly ratingAverage?: number,
    public readonly ratingCount?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    // Relations - sử dụng proper entities
    public readonly brand?: BrandEntity,
    public readonly category?: CategoryEntity,
    public readonly variants?: ProductVariantEntity[],
    // Value objects
    public readonly images?: ProductImage[],
    public readonly reviews?: ProductReview[],
  ) {}

  // Business logic methods
  isHighRated(): boolean {
    return (this.ratingAverage || 0) >= 4.0;
  }

  getMainImage(): string | null {
    const mainImage = this.images?.find(img => img.isFirst());
    return mainImage?.url || this.images?.[0]?.url || null;
  }

  getAllImages(): string[] {
    return this.images?.map(img => img.url) || [];
  }

  getAvailableVariants(): ProductVariantEntity[] {
    return this.variants?.filter(v => v.isAvailable()) || [];
  }

  getMinPrice(): number | null {
    const availableVariants = this.getAvailableVariants();
    const prices = availableVariants
      .map(v => v.getCurrentPriceAmount())
      .filter(p => p !== null) as number[];
    
    return prices.length > 0 ? Math.min(...prices) : null;
  }

  getMaxPrice(): number | null {
    const availableVariants = this.getAvailableVariants();
    const prices = availableVariants
      .map(v => v.getCurrentPriceAmount())
      .filter(p => p !== null) as number[];
    
    return prices.length > 0 ? Math.max(...prices) : null;
  }

  getPriceRange(): { min: number; max: number } | null {
    const min = this.getMinPrice();
    const max = this.getMaxPrice();
    
    return min !== null && max !== null ? { min, max } : null;
  }

  isInStock(): boolean {
    return this.getAvailableVariants().length > 0;
  }

  getTotalStock(): number {
    return this.getAvailableVariants()
      .reduce((total, variant) => total + variant.getStock(), 0);
  }

  getAvailableColors(): ColorEntity[] {
    const variants = this.getAvailableVariants();
    const colors = variants
      .map(v => v.color)
      .filter(c => c !== undefined) as ColorEntity[];
    
    // Remove duplicates
    return colors.filter((color, index, self) => 
      self.findIndex(c => c.id === color.id) === index
    );
  }

  getAvailableSizes(): SizeEntity[] {
    const variants = this.getAvailableVariants();
    const sizes = variants
      .map(v => v.size)
      .filter(s => s !== undefined) as SizeEntity[];
    
    // Remove duplicates và sort
    const uniqueSizes = sizes.filter((size, index, self) => 
      self.findIndex(s => s.id === size.id) === index
    );

    return uniqueSizes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  getVariantByColorAndSize(colorId: string, sizeId: string): ProductVariantEntity | null {
    return this.variants?.find(v => v.isSameVariant(colorId, sizeId)) || null;
  }

  hasVariants(): boolean {
    return (this.variants?.length || 0) > 0;
  }

  isOnSale(): boolean {
    return this.getAvailableVariants().some(v => v.isOnSale());
  }

  getAverageRating(): number {
    return this.ratingAverage || 0;
  }

  getReviewSummary(): {
    total: number;
    average: number;
    positive: number;
    negative: number;
    neutral: number;
  } {
    const reviews = this.reviews || [];
    
    return {
      total: reviews.length,
      average: this.getAverageRating(),
      positive: reviews.filter(r => r.isPositive()).length,
      negative: reviews.filter(r => r.isNegative()).length,
      neutral: reviews.filter(r => r.isNeutral()).length,
    };
  }

  getUrl(): string {
    return `/products/${this.slug}`;
  }

  equals(other: ProductEntity): boolean {
    return this.id === other.id;
  }

  // Validation methods
  isValid(): boolean {
    return this.name.length > 0 && 
           this.slug.length > 0 && 
           this.brandId.length > 0 && 
           this.categoryId.length > 0;
  }
}
