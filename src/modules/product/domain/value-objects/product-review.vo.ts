export class ProductReview {
  constructor(
    public readonly id: string,
    public readonly rating: number,
    public readonly comment?: string,
    public readonly userName?: string,
    public readonly createdAt?: Date,
  ) {}

  isPositive(): boolean {
    return this.rating >= 4;
  }

  isNegative(): boolean {
    return this.rating <= 2;
  }

  isNeutral(): boolean {
    return this.rating === 3;
  }

  isValid(): boolean {
    return this.rating >= 1 && this.rating <= 5;
  }

  hasComment(): boolean {
    return !!this.comment && this.comment.trim().length > 0;
  }

  getStarRating(): string {
    return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
  }

  getShortComment(maxLength: number = 100): string {
    if (!this.comment) return '';
    
    if (this.comment.length <= maxLength) {
      return this.comment;
    }
    
    return this.comment.substring(0, maxLength) + '...';
  }

  getRatingLabel(): string {
    switch (this.rating) {
      case 5: return 'Excellent';
      case 4: return 'Good';
      case 3: return 'Average';
      case 2: return 'Poor';
      case 1: return 'Very Poor';
      default: return 'Unknown';
    }
  }

  equals(other: ProductReview): boolean {
    return this.id === other.id;
  }
}
