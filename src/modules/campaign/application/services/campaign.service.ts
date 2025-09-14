import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import type { ICampaignRepository, ICampaignService } from '../../domain/interfaces/campaign.interfaces';
import { Campaign, CampaignEligibilityResult, CartItem, CampaignStats } from '../../domain/entities/campaign.entity';
import { CreateCampaignDto, UpdateCampaignDto, CartItemDto } from '../dto/campaign.dto';

@Injectable()
export class CampaignService implements ICampaignService {
  constructor(
    @Inject('ICampaignRepository')
    private readonly campaignRepository: ICampaignRepository
  ) {}

  async createCampaign(data: CreateCampaignDto): Promise<Campaign> {
    // Validate campaign code uniqueness
    if (data.code) {
      const existingCampaign = await this.campaignRepository.findByCode(data.code);
      if (existingCampaign) {
        throw new BadRequestException('Campaign code already exists');
      }
    }

    // Validate date range
    if (data.endDate <= data.startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    return this.campaignRepository.create({
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
      rules: data.rules
    });
  }

  async getCampaigns(status?: string): Promise<Campaign[]> {
    return this.campaignRepository.findMany({ status });
  }

  async getCampaignById(id: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    return campaign;
  }

  async getCampaignByCode(code: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findByCode(code);
    if (!campaign) {
      throw new NotFoundException('Campaign code not found');
    }
    return campaign;
  }

  async checkCampaignEligibility(
    cartItems: CartItem[],
    userId: string,
    campaignCode?: string
  ): Promise<CampaignEligibilityResult> {
    if (!campaignCode) {
      return { eligible: false, reason: 'No campaign code provided' };
    }

    try {
      const campaign = await this.getCampaignByCode(campaignCode);
      
      // Basic validation
      const now = new Date();
      if (campaign.status !== 'ACTIVE') {
        return { eligible: false, reason: 'Campaign is not active' };
      }
      
      if (campaign.startDate > now) {
        return { eligible: false, reason: 'Campaign has not started yet' };
      }
      
      if (campaign.endDate < now) {
        return { eligible: false, reason: 'Campaign has expired' };
      }

      // Check usage limits
      if (campaign.maxUses && campaign.usedCount >= campaign.maxUses) {
        return { eligible: false, reason: 'Campaign usage limit reached' };
      }

      // Calculate cart total
      const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Check minimum order value
      if (campaign.minOrderValue && cartTotal < campaign.minOrderValue) {
        return { 
          eligible: false, 
          reason: `Minimum order value of ${campaign.minOrderValue} not met` 
        };
      }

      // Calculate discount
      const discountAmount = this.calculateDiscount(campaign, cartTotal);
      const finalPrice = Math.max(0, cartTotal - discountAmount);

      return {
        eligible: true,
        campaign,
        discountAmount,
        finalPrice
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { eligible: false, reason: 'Invalid campaign code' };
      }
      throw error;
    }
  }

  async getCampaignStats(campaignId: string): Promise<CampaignStats> {
    const campaign = await this.getCampaignById(campaignId);
    
    // Basic stats implementation
    return {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        totalUses: campaign.usedCount || 0,
        maxUses: campaign.maxUses
      },
      stats: {
        totalUsers: campaign.userUsages?.length || 0,
        totalSavings: campaign.userUsages?.reduce((sum, usage) => 
          sum + (usage.discountAmount || 0), 0) || 0,
        averageSavings: 0, // Will calculate if needed
        usageRate: campaign.maxUses ? 
          (campaign.usedCount / campaign.maxUses) * 100 : undefined
      }
    };
  }

  private calculateDiscount(campaign: Campaign, cartTotal: number): number {
    let discountAmount = 0;

    switch (campaign.discountType) {
      case 'PERCENTAGE':
        discountAmount = cartTotal * (campaign.discountValue / 100);
        if (campaign.maxDiscount) {
          discountAmount = Math.min(discountAmount, campaign.maxDiscount);
        }
        break;
      
      case 'FIXED_AMOUNT':
        discountAmount = Math.min(campaign.discountValue, cartTotal);
        break;
      
      case 'FREE_SHIPPING':
        // For free shipping, return a symbolic amount or handle separately
        discountAmount = 0;
        break;
      
      default:
        discountAmount = 0;
    }

    return discountAmount;
  }
}