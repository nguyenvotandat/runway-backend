import { ColorEntity } from './color.entity';
import { SizeEntity } from './size.entity';
import { InventoryEntity } from './inventory.entity';
import { PriceEntity } from './price.entity';

export type VariantStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export class ProductVariantEntity {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly colorId: string,
    public readonly sizeId: string,
    public readonly sku: string,
    public readonly status: VariantStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    // Relations
    public readonly color?: ColorEntity,
    public readonly size?: SizeEntity,
    public readonly inventory?: InventoryEntity,
    public readonly prices?: PriceEntity[],
  ) {}

  // Business methods
  isAvailable(): boolean {
    return this.status === 'ACTIVE' && this.getStock() > 0;
  }

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  getStock(): number {
    return this.inventory?.quantity || 0;
  }

  getCurrentPrice(): PriceEntity | null {
    if (!this.prices?.length) return null;
    
    return this.prices
      .filter(p => p.isCurrent())
      .sort((a, b) => b.validFrom.getTime() - a.validFrom.getTime())[0] || null;
  }

  getCurrentPriceAmount(): number | null {
    const price = this.getCurrentPrice();
    return price ? price.getDiscountedPrice() : null;
  }

  generateSKU(): string {
    // Business logic để generate SKU
    const productCode = this.productId.slice(-4).toUpperCase();
    const colorCode = this.colorId.slice(-2).toUpperCase();
    const sizeCode = this.sizeId.slice(-2).toUpperCase();
    return `${productCode}-${colorCode}-${sizeCode}`;
  }

  getDisplayName(): string {
    const colorName = this.color?.name || 'Unknown Color';
    const sizeName = this.size?.label || 'Unknown Size';
    return `${colorName} / ${sizeName}`;
  }

  isOnSale(): boolean {
    const currentPrice = this.getCurrentPrice();
    return currentPrice ? currentPrice.isOnSale() : false;
  }

  getDiscountPercentage(): number {
    const currentPrice = this.getCurrentPrice();
    return currentPrice ? currentPrice.getDiscountPercentage() : 0;
  }

  canFulfillOrder(quantity: number): boolean {
    return this.isAvailable() && this.inventory?.canFulfill(quantity) === true;
  }

  getStockStatus(): 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' {
    return this.inventory?.getStockStatus() || 'OUT_OF_STOCK';
  }

  equals(other: ProductVariantEntity): boolean {
    return this.id === other.id;
  }

  isSameVariant(colorId: string, sizeId: string): boolean {
    return this.colorId === colorId && this.sizeId === sizeId;
  }
}
