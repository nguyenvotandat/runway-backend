export type SizeCategory = 'CLOTHING' | 'SHOES' | 'ACCESSORIES';

export class SizeEntity {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly category?: SizeCategory,
    public readonly sortOrder?: number, // Để sort S < M < L < XL
  ) {}

  // Business methods
  isLargerThan(other: SizeEntity): boolean {
    return (this.sortOrder || 0) > (other.sortOrder || 0);
  }

  isSmallerThan(other: SizeEntity): boolean {
    return (this.sortOrder || 0) < (other.sortOrder || 0);
  }

  isEqualTo(other: SizeEntity): boolean {
    return this.id === other.id;
  }

  getDisplayName(): string {
    return this.label.toUpperCase();
  }

  isStandardClothingSize(): boolean {
    const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
    return standardSizes.includes(this.label.toUpperCase());
  }

  equals(other: SizeEntity): boolean {
    return this.id === other.id;
  }
}
