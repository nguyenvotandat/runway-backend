import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid'; // 👉 cần cài: npm install uuid

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Runway database...');

  // --- BRAND ---
  const brand = await prisma.brand.upsert({
    where: { name: 'Runway' },
    update: {},
    create: {
      id: uuidv4(),
      name: 'Runway',
    },
  });

  // --- CATEGORIES ---
  const categoryNames = ['Áo thun', 'Quần jeans', 'Giày'];
  const categories = await Promise.all(
    categoryNames.map(async (name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: {
          id: uuidv4(),
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        },
      })
    )
  );

  // --- COLORS ---
  const colorData = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Blue', hex: '#0000FF' },
  ];

  const colors = await Promise.all(
    colorData.map(({ name, hex }) =>
      prisma.color.upsert({
        where: { name },
        update: {},
        create: {
          id: uuidv4(),
          name,
          hex,
        },
      })
    )
  );

  // --- SIZES ---
  const sizeLabels = ['S', 'M', 'L', 'XL'];
  const sizes = await Promise.all(
    sizeLabels.map((label) =>
      prisma.size.upsert({
        where: { label },
        update: {},
        create: {
          id: uuidv4(),
          label,
        },
      })
    )
  );

  // --- USER ADMIN ---
  const adminPassword = await argon2.hash('123456');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@runway.com' },
    update: {},
    create: {
      id: uuidv4(),
      email: 'admin@runway.com',
      password: adminPassword,
      name: 'Admin User',
    },
  });

  // --- TAGS ---
  const tagNames = ['Basic', 'Trending', '2025'];
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: {
          id: uuidv4(),
          name,
        },
      })
    )
  );

  // --- PRODUCT ---
  const product = await prisma.product.create({
    data: {
      id: uuidv4(),
      name: 'Áo thun Runway',
      slug: 'ao-thun-runway',
      description: 'Chiếc áo thun phong cách hiện đại, chất liệu cotton thoáng mát.',
      brandId: brand.id,
      categoryId: categories[0].id,
      ratingAverage: 4.5,
      ratingCount: 10,
      productImages: {
        create: [
          {
            id: uuidv4(),
            url: 'https://example.com/images/ao-thun-1.jpg',
            sortOrder: 0,
          },
        ],
      },
      productTags: {
        create: tags.map((tag) => ({
          tagId: tag.id,
        })),
      },
    },
  });

  // --- PRODUCT VARIANT ---
  const variant = await prisma.productVariant.create({
    data: {
      id: uuidv4(),
      productId: product.id,
      colorId: colors[0].id,
      sizeId: sizes[1].id,
      sku: 'SKU-AOTHUN-001',
      status: 'ACTIVE',
      inventory: {
        create: {
          quantity: 100,
          safetyStock: 10,
          updatedAt: new Date(),
        },
      },
      prices: {
        create: {
          id: uuidv4(),
          amount: 199000,
          currency: 'VND',
          validFrom: new Date(),
        },
      },
    },
  });

  // --- REVIEW ---
  await prisma.review.create({
    data: {
      id: uuidv4(),
      productId: product.id,
      userId: admin.id,
      rating: 5,
      comment: 'Sản phẩm rất tốt!',
    },
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
