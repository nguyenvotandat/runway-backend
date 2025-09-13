export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export class InventoryEntity {
  constructor(
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly safetyStock: number,
    public readonly updatedAt: Date,
  ) {}

  // Business methods
  isInStock(): boolean {
    return this.quantity > 0;
  }

  isLowStock(): boolean {
    return this.quantity <= this.safetyStock && this.quantity > 0;
  }

  needsReorder(): boolean {
    return this.quantity < this.safetyStock;
  }

  canFulfill(requestedQuantity: number): boolean {
    return this.quantity >= requestedQuantity;
  }

  getStockStatus(): StockStatus {
    if (this.quantity === 0) return 'OUT_OF_STOCK';
    if (this.isLowStock()) return 'LOW_STOCK';
    return 'IN_STOCK';
  }

  getAvailableQuantity(): number {
    return Math.max(0, this.quantity);
  }

  calculateReorderQuantity(targetStock: number = this.safetyStock * 2): number {
    return Math.max(0, targetStock - this.quantity);
  }

  // Simulate stock operations (in real app, these would be use cases)
  reserve(quantity: number): boolean {
    return this.canFulfill(quantity);
  }

  getStockPercentage(): number {
    if (this.safetyStock === 0) return 100;
    return Math.min(100, (this.quantity / this.safetyStock) * 100);
  }
}
