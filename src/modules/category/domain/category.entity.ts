export class CategoryEntity {
  id: string;
  name: string;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
