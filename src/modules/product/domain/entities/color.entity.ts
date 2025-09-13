export class ColorEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly hex: string,
  ) {}

  // Business methods
  isValidHex(): boolean {
    return /^#[0-9A-F]{6}$/i.test(this.hex);
  }

  getContrastColor(): string {
    // Tính màu contrast cho text
    const r = parseInt(this.hex.slice(1, 3), 16);
    const g = parseInt(this.hex.slice(3, 5), 16);
    const b = parseInt(this.hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  getRgb(): { r: number; g: number; b: number } {
    return {
      r: parseInt(this.hex.slice(1, 3), 16),
      g: parseInt(this.hex.slice(3, 5), 16),
      b: parseInt(this.hex.slice(5, 7), 16),
    };
  }

  equals(other: ColorEntity): boolean {
    return this.id === other.id;
  }
}
