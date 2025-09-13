export class ProductImage {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly sortOrder: number,
  ) {}

  isFirst(): boolean {
    return this.sortOrder === 0;
  }

  isValid(): boolean {
    return this.url.length > 0 && this.isValidUrl();
  }

  private isValidUrl(): boolean {
    try {
      new URL(this.url);
      return true;
    } catch {
      return false;
    }
  }

  getFileExtension(): string {
    const url = new URL(this.url);
    const pathname = url.pathname;
    return pathname.split('.').pop()?.toLowerCase() || '';
  }

  isImageFormat(): boolean {
    const validFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    return validFormats.includes(this.getFileExtension());
  }

  equals(other: ProductImage): boolean {
    return this.id === other.id;
  }
}
