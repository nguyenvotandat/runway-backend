export class BrandEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  getDisplayName(): string {
    return this.name;
  }

  equals(other: BrandEntity): boolean {
    return this.id === other.id;
  }
}
