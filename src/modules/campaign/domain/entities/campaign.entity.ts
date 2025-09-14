export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING'
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
  DISABLED = 'DISABLED'
}

export enum RuleType {
  INCLUDE = 'INCLUDE',
  EXCLUDE = 'EXCLUDE'
}

export enum TargetType {
  ALL_PRODUCTS = 'ALL_PRODUCTS',
  SPECIFIC_PRODUCT = 'SPECIFIC_PRODUCT',
  PRODUCT_VARIANT = 'PRODUCT_VARIANT',
  CATEGORY = 'CATEGORY',
  BRAND = 'BRAND',
  TAG = 'TAG',
  PRICE_RANGE = 'PRICE_RANGE'
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  code?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  startDate: Date;
  endDate: Date;
  maxUses?: number;
  maxUsesPerUser?: number;
  usedCount: number;
  status: CampaignStatus;
  priority: number;
  isAutoApply: boolean;
  createdAt: Date;
  updatedAt: Date;
  rules?: CampaignRule[];
  userUsages?: CampaignUserUsage[];
}

export interface CampaignRule {
  id: string;
  campaignId: string;
  ruleType: RuleType;
  targetType: TargetType;
  targetId?: string;
  minQuantity?: number;
  conditions?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignUserUsage {
  id: string;
  campaignId: string;
  userId: string;
  usedAt: Date;
  orderValue?: number;
  discountAmount?: number;
}

export interface CartItem {
  variantId: string;
  quantity: number;
  price: number;
  productId?: string;
  categoryId?: string;
  brandId?: string;
}

export interface CampaignEligibilityResult {
  eligible: boolean;
  campaign?: Campaign;
  reason?: string;
  discountAmount?: number;
  finalPrice?: number;
}

export interface CampaignStats {
  campaign: {
    id: string;
    name: string;
    status: CampaignStatus;
    totalUses: number;
    maxUses?: number;
  };
  stats: {
    totalUsers: number;
    totalSavings: number;
    averageSavings: number;
    usageRate?: number;
  };
}