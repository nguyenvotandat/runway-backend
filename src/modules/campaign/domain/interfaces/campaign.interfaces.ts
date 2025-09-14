import { Campaign, CampaignRule, CampaignEligibilityResult, CartItem, CampaignStats } from '../entities/campaign.entity';

export interface ICampaignRepository {
  findById(id: string): Promise<Campaign | null>;
  findByCode(code: string): Promise<Campaign | null>;
  findMany(filters?: { status?: string }): Promise<Campaign[]>;
  create(data: CreateCampaignData): Promise<Campaign>;
  update(id: string, data: UpdateCampaignData): Promise<Campaign>;
  delete(id: string): Promise<void>;
  incrementUsedCount(id: string): Promise<Campaign>;
}

export interface ICampaignService {
  createCampaign(data: CreateCampaignData): Promise<Campaign>;
  getCampaigns(status?: string): Promise<Campaign[]>;
  getCampaignById(id: string): Promise<Campaign>;
  getCampaignByCode(code: string): Promise<Campaign>;
  checkCampaignEligibility(cartItems: CartItem[], userId: string, campaignCode?: string): Promise<CampaignEligibilityResult>;
  getCampaignStats(campaignId: string): Promise<CampaignStats>;
}

export interface CreateCampaignData {
  name: string;
  description?: string;
  code?: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  startDate: Date;
  endDate: Date;
  maxUses?: number;
  maxUsesPerUser?: number;
  status?: string;
  priority?: number;
  isAutoApply?: boolean;
  rules: CreateRuleData[];
}

export interface CreateRuleData {
  ruleType: string;
  targetType: string;
  targetId?: string;
  minQuantity?: number;
  conditions?: any;
}

export interface UpdateCampaignData {
  name?: string;
  description?: string;
  status?: string;
  priority?: number;
  maxUses?: number;
  endDate?: Date;
}