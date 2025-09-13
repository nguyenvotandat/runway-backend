export class PriceEntity {
  constructor(
    public readonly id: string,
    public readonly variantId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly validFrom: Date,
    public readonly discount?: number,
    public readonly validTo?: Date,
  ) {}

  // Business methods
  isCurrent(): boolean {
    const now = new Date();
    return now >= this.validFrom && (!this.validTo || now <= this.validTo);
  }

  getDiscountedPrice(): number {
    return this.discount ? this.amount - this.discount : this.amount;
  }

  getDiscountPercentage(): number {
    return this.discount ? Math.round((this.discount / this.amount) * 100) : 0;
  }

  isOnSale(): boolean {
    return this.discount !== undefined && this.discount > 0;
  }

  format(locale: string = 'vi-VN'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency === 'VND' ? 'VND' : 'USD',
    }).format(this.getDiscountedPrice());
  }

  formatOriginalPrice(locale: string = 'vi-VN'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency === 'VND' ? 'VND' : 'USD',
    }).format(this.amount);
  }

  getSavingsAmount(): number {
    return this.discount || 0;
  }

  isExpired(): boolean {
    return this.validTo ? new Date() > this.validTo : false;
  }

  isValid(): boolean {
    return this.isCurrent() && !this.isExpired();
  }

  compareTo(other: PriceEntity): number {
    return this.getDiscountedPrice() - other.getDiscountedPrice();
  }
}
