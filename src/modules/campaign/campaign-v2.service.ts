import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

// DTOs for API
export interface CreateCampaignDto {
  name: string;
  description?: string;
  code?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  startDate: Date;
  endDate: Date;
  maxUses?: number;
  maxUsesPerUser?: number;
  status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'DISABLED';
  priority?: number;
  isAutoApply?: boolean;
  rules: CreateRuleDto[];
}

export interface CreateRuleDto {
  ruleType: 'INCLUDE' | 'EXCLUDE';
  targetType: 'ALL_PRODUCTS' | 'SPECIFIC_PRODUCT' | 'PRODUCT_VARIANT' | 'CATEGORY' | 'BRAND' | 'TAG' | 'PRICE_RANGE';
  targetId?: string;
  minQuantity?: number;
  conditions?: any;
}

export interface CampaignEligibilityResult {
  eligible: boolean;
  campaign?: any;
  reason?: string;
  discountAmount?: number;
}

export interface CartItem {
  variantId: string;
  quantity: number;
  price: number;
}

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  // === BASIC CAMPAIGN MANAGEMENT ===

  async createCampaign(data: CreateCampaignDto) {
    // Validate campaign code uniqueness
    if (data.code) {
      const existingCampaign = await this.prisma.discount_campaign.findUnique({
        where: { code: data.code }
      });
      if (existingCampaign) {
        throw new BadRequestException('Campaign code already exists');
      }
    }

    return this.prisma.discount_campaign.create({
      data: {
        name: data.name,
        description: data.description,
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxDiscount: data.maxDiscount,
        minOrderValue: data.minOrderValue,
        startDate: data.startDate,
        endDate: data.endDate,
        maxUses: data.maxUses,
        maxUsesPerUser: data.maxUsesPerUser,
        status: data.status || 'DRAFT',
        priority: data.priority || 0,
        isAutoApply: data.isAutoApply || false,
        rules: {
          create: data.rules
        }
      },
      include: {
        rules: true
      }
    });
  }

  async getCampaigns(status?: string) {
    return this.prisma.discount_campaign.findMany({
      where: status ? { status: status as any } : {},
      include: {
        rules: true,
        _count: {
          select: { user_usages: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  async getCampaignById(id: string) {
    const campaign = await this.prisma.discount_campaign.findUnique({
      where: { id },
      include: {
        rules: true,
        user_usages: true
      }
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async getCampaignByCode(code: string) {
    const campaign = await this.prisma.discount_campaign.findUnique({
      where: { code },
      include: { rules: true }
    });

    if (!campaign) {
      throw new NotFoundException('Campaign code not found');
    }

    return campaign;
  }

  // === DISCOUNT CALCULATION ===

  async checkCampaignEligibility(
    cartItems: CartItem[],
    userId: string,
    campaignCode?: string
  ): Promise<CampaignEligibilityResult> {
    
    // For now, return simple eligibility check
    // Will implement full logic later
    if (campaignCode) {
      try {
        const campaign = await this.getCampaignByCode(campaignCode);
        
        // Basic checks
        const now = new Date();
        if (campaign.status !== 'ACTIVE' || 
            campaign.startDate > now || 
            campaign.endDate < now) {
          return { eligible: false, reason: 'Campaign is not active' };
        }

        // Simple discount calculation for now
        const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discountAmount = 0;

        if (campaign.discountType === 'PERCENTAGE') {
          discountAmount = cartTotal * (Number(campaign.discountValue) / 100);
          if (campaign.maxDiscount) {
            discountAmount = Math.min(discountAmount, Number(campaign.maxDiscount));
          }
        } else if (campaign.discountType === 'FIXED_AMOUNT') {
          discountAmount = Math.min(Number(campaign.discountValue), cartTotal);
        }

        return {
          eligible: true,
          campaign,
          discountAmount
        };
      } catch {
        return { eligible: false, reason: 'Invalid campaign code' };
      }
    }

    return { eligible: false, reason: 'No campaign code provided' };
  }

  async getCampaignStats(campaignId: string) {
    const campaign = await this.getCampaignById(campaignId);
    
    // Basic stats for now
    return {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        totalUses: campaign.usedCount || 0,
        maxUses: campaign.maxUses
      },
      stats: {
        totalUsers: 0, // Will implement later
        totalSavings: 0,
        averageSavings: 0,
        usageRate: campaign.maxUses ? (campaign.usedCount / campaign.maxUses) * 100 : null
      }
    };
  }
}