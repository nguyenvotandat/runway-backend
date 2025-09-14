import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infra/prisma/prisma.service';
import type { ICampaignRepository, CreateCampaignData, UpdateCampaignData } from '../../domain/interfaces/campaign.interfaces';
import { Campaign } from '../../domain/entities/campaign.entity';

@Injectable()
export class CampaignRepository implements ICampaignRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Campaign | null> {
    const campaign = await this.prisma.discount_campaign.findUnique({
      where: { id },
      include: {
        rules: true,
        user_usages: true
      }
    });

    return campaign ? this.mapToDomain(campaign) : null;
  }

  async findByCode(code: string): Promise<Campaign | null> {
    const campaign = await this.prisma.discount_campaign.findUnique({
      where: { code },
      include: {
        rules: true,
        user_usages: true
      }
    });

    return campaign ? this.mapToDomain(campaign) : null;
  }

  async findMany(filters?: { status?: string }): Promise<Campaign[]> {
    const campaigns = await this.prisma.discount_campaign.findMany({
      where: filters?.status ? { status: filters.status as any } : {},
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

    return campaigns.map(campaign => this.mapToDomain(campaign));
  }

  async create(data: CreateCampaignData): Promise<Campaign> {
    const campaign = await this.prisma.discount_campaign.create({
      data: {
        name: data.name,
        description: data.description,
        code: data.code,
        discountType: data.discountType as any,
        discountValue: data.discountValue,
        maxDiscount: data.maxDiscount,
        minOrderValue: data.minOrderValue,
        startDate: data.startDate,
        endDate: data.endDate,
        maxUses: data.maxUses,
        maxUsesPerUser: data.maxUsesPerUser,
        status: data.status as any || 'DRAFT',
        priority: data.priority || 0,
        isAutoApply: data.isAutoApply || false,
        rules: {
          create: data.rules.map(rule => ({
            ruleType: rule.ruleType as any,
            targetType: rule.targetType as any,
            targetId: rule.targetId,
            minQuantity: rule.minQuantity,
            conditions: rule.conditions
          }))
        }
      },
      include: {
        rules: true,
        user_usages: true
      }
    });

    return this.mapToDomain(campaign);
  }

  async update(id: string, data: UpdateCampaignData): Promise<Campaign> {
    const campaign = await this.prisma.discount_campaign.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        status: data.status as any,
        priority: data.priority,
        maxUses: data.maxUses,
        endDate: data.endDate
      },
      include: {
        rules: true,
        user_usages: true
      }
    });

    return this.mapToDomain(campaign);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.discount_campaign.delete({
      where: { id }
    });
  }

  async incrementUsedCount(id: string): Promise<Campaign> {
    const campaign = await this.prisma.discount_campaign.update({
      where: { id },
      data: {
        usedCount: {
          increment: 1
        }
      },
      include: {
        rules: true,
        user_usages: true
      }
    });

    return this.mapToDomain(campaign);
  }

  private mapToDomain(prismaData: any): Campaign {
    return {
      id: prismaData.id,
      name: prismaData.name,
      description: prismaData.description,
      code: prismaData.code,
      discountType: prismaData.discountType,
      discountValue: prismaData.discountValue,
      maxDiscount: prismaData.maxDiscount,
      minOrderValue: prismaData.minOrderValue,
      startDate: prismaData.startDate,
      endDate: prismaData.endDate,
      maxUses: prismaData.maxUses,
      maxUsesPerUser: prismaData.maxUsesPerUser,
      usedCount: prismaData.usedCount || 0,
      status: prismaData.status,
      priority: prismaData.priority,
      isAutoApply: prismaData.isAutoApply,
      createdAt: prismaData.createdAt,
      updatedAt: prismaData.updatedAt,
      rules: prismaData.rules?.map((rule: any) => ({
        id: rule.id,
        campaignId: rule.campaignId,
        ruleType: rule.ruleType,
        targetType: rule.targetType,
        targetId: rule.targetId,
        minQuantity: rule.minQuantity,
        conditions: rule.conditions,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt
      })),
      userUsages: prismaData.user_usages?.map((usage: any) => ({
        id: usage.id,
        campaignId: usage.campaignId,
        userId: usage.userId,
        usedAt: usage.lastUsed,
        orderValue: 0, // Will be calculated from usage data
        discountAmount: Number(usage.totalSaved)
      }))
    };
  }
}