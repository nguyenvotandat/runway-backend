import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CampaignService } from '../../application/services/campaign.service';
import { CreateCampaignDto, UpdateCampaignDto, ValidateVoucherDto } from '../../application/dto/campaign.dto';
import { Public } from '../../../../common/decorators/public.decorator';

@Public() // Make all campaign endpoints public for testing
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return await this.campaignService.createCampaign(createCampaignDto);
  }

  @Get()
  async getCampaigns(@Query('status') status?: string) {
    return await this.campaignService.getCampaigns(status);
  }

  @Get(':id')
  async getCampaignById(@Param('id') id: string) {
    return await this.campaignService.getCampaignById(id);
  }

  @Put(':id')
  async updateCampaign(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto
  ) {
    // For now, we'll implement update later
    throw new Error('Update campaign not implemented yet');
  }

  @Delete(':id')
  async deleteCampaign(@Param('id') id: string) {
    // For now, we'll implement delete later
    throw new Error('Delete campaign not implemented yet');
  }

  @Post('validate-voucher')
  async validateVoucher(@Body() validateVoucherDto: ValidateVoucherDto) {
    return await this.campaignService.checkCampaignEligibility(
      validateVoucherDto.cartItems,
      validateVoucherDto.userId,
      validateVoucherDto.code
    );
  }

  @Get(':id/stats')
  async getCampaignStats(@Param('id') id: string) {
    return await this.campaignService.getCampaignStats(id);
  }

  @Get('code/:code')
  async getCampaignByCode(@Param('code') code: string) {
    return await this.campaignService.getCampaignByCode(code);
  }
}