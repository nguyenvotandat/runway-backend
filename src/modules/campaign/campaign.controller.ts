import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CampaignService, CreateCampaignDto, CampaignEligibilityResult } from './campaign-v2.service';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.createCampaign(createCampaignDto);
  }

  @Get()
  async getCampaigns(@Query('status') status?: string) {
    return this.campaignService.getCampaigns(status);
  }

  @Get(':id')
  async getCampaignById(@Param('id') id: string) {
    return this.campaignService.getCampaignById(id);
  }

  @Get('code/:code')
  async getCampaignByCode(@Param('code') code: string) {
    return this.campaignService.getCampaignByCode(code);
  }

  @Post('check-eligibility')
  @HttpCode(HttpStatus.OK)
  async checkCampaignEligibility(@Body() body: {
    cartItems: Array<{ variantId: string; quantity: number; price: number }>;
    userId: string;
    campaignCode?: string;
  }): Promise<CampaignEligibilityResult> {
    const { cartItems, userId, campaignCode } = body;
    return this.campaignService.checkCampaignEligibility(cartItems, userId, campaignCode);
  }

  @Get(':id/stats')
  async getCampaignStats(@Param('id') id: string) {
    return this.campaignService.getCampaignStats(id);
  }
}