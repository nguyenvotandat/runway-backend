export class CategoryEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  getDisplayName(): string {
    return this.name;
  }

  getUrl(): string {
    return `/categories/${this.slug}`;
  }

  equals(other: CategoryEntity): boolean {
    return this.id === other.id;
  }
}
