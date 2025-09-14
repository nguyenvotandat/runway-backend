import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCampaigns() {
  console.log('🌱 Seeding campaign data...');

  try {
    // Clear existing campaigns
    await prisma.campaign_user_usage.deleteMany();
    await prisma.discount_rule.deleteMany();
    await prisma.discount_campaign.deleteMany();
    console.log('✅ Cleared existing campaign data');

    // Create sample campaigns
    const campaign1 = await prisma.discount_campaign.create({
      data: {
        name: 'Summer Sale 2025',
        description: '25% off all products summer campaign',
        code: 'SUMMER25',
        discountType: 'PERCENTAGE',
        discountValue: 25,
        maxDiscount: 100000,
        minOrderValue: 50000,
        startDate: new Date('2025-09-15T00:00:00.000Z'),
        endDate: new Date('2025-12-31T23:59:59.000Z'),
        maxUses: 1000,
        maxUsesPerUser: 3,
        status: 'ACTIVE',
        priority: 10,
        isAutoApply: false,
        rules: {
          create: [
            {
              ruleType: 'INCLUDE',
              targetType: 'ALL_PRODUCTS'
            }
          ]
        }
      },
      include: { rules: true }
    });

    const campaign2 = await prisma.discount_campaign.create({
      data: {
        name: 'Flash Sale Weekend',
        description: 'Fixed discount 50,000đ for orders over 200,000đ',
        code: 'FLASH50K',
        discountType: 'FIXED_AMOUNT',
        discountValue: 50000,
        minOrderValue: 200000,
        startDate: new Date('2025-09-15T00:00:00.000Z'),
        endDate: new Date('2025-09-17T23:59:59.000Z'),
        maxUses: 100,
        maxUsesPerUser: 1,
        status: 'ACTIVE',
        priority: 20,
        isAutoApply: false,
        rules: {
          create: [
            {
              ruleType: 'INCLUDE',
              targetType: 'ALL_PRODUCTS'
            }
          ]
        }
      },
      include: { rules: true }
    });

    const campaign3 = await prisma.discount_campaign.create({
      data: {
        name: 'Free Shipping Campaign',
        description: 'Free shipping for all orders',
        code: 'FREESHIP',
        discountType: 'FREE_SHIPPING',
        discountValue: 0,
        minOrderValue: 100000,
        startDate: new Date('2025-09-15T00:00:00.000Z'),
        endDate: new Date('2025-10-31T23:59:59.000Z'),
        maxUses: 500,
        maxUsesPerUser: 5,
        status: 'ACTIVE',
        priority: 5,
        isAutoApply: true,
        rules: {
          create: [
            {
              ruleType: 'INCLUDE',
              targetType: 'ALL_PRODUCTS'
            }
          ]
        }
      },
      include: { rules: true }
    });

    // Create a draft campaign
    const campaign4 = await prisma.discount_campaign.create({
      data: {
        name: 'Black Friday 2025',
        description: '50% off selected categories',
        code: 'BLACKFRIDAY50',
        discountType: 'PERCENTAGE',
        discountValue: 50,
        maxDiscount: 500000,
        minOrderValue: 100000,
        startDate: new Date('2025-11-25T00:00:00.000Z'),
        endDate: new Date('2025-11-30T23:59:59.000Z'),
        maxUses: 2000,
        maxUsesPerUser: 2,
        status: 'DRAFT',
        priority: 30,
        isAutoApply: false,
        rules: {
          create: [
            {
              ruleType: 'INCLUDE',
              targetType: 'CATEGORY',
              targetId: 'electronics' // Assume this category exists
            },
            {
              ruleType: 'INCLUDE',
              targetType: 'CATEGORY', 
              targetId: 'fashion' // Assume this category exists
            }
          ]
        }
      },
      include: { rules: true }
    });

    console.log('✅ Created campaigns:');
    console.log(`📊 ${campaign1.name} (${campaign1.code}) - ${campaign1.status}`);
    console.log(`📊 ${campaign2.name} (${campaign2.code}) - ${campaign2.status}`);
    console.log(`📊 ${campaign3.name} (${campaign3.code}) - ${campaign3.status}`);
    console.log(`📊 ${campaign4.name} (${campaign4.code}) - ${campaign4.status}`);

    console.log('\n🎉 Campaign seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding campaigns:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedCampaigns()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export default seedCampaigns;