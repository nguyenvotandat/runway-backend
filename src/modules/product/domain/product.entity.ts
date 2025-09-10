export class ProductImageEntity {
  id: string;
  url: string;
  productId: string;

  constructor(partial: Partial<ProductImageEntity>) {
    Object.assign(this, partial);
  }
}

export class ProductColorEntity {
  id: string;
  name: string;
  hex: string;
  productId: string;

  constructor(partial: Partial<ProductColorEntity>) {
    Object.assign(this, partial);
  }
}

export class ProductEntity {
  id: string;
  name: string;
  brand: string;
  price: number;
  categoryId: string;
  glbUrl?: string;
  createdAt: Date;
  images: ProductImageEntity[];
  colors: ProductColorEntity[];
  category?: {
    id: string;
    name: string;
  };

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
