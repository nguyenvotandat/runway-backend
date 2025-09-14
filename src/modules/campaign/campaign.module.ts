import { Module } from '@nestjs/common';
import { CampaignService } from './campaign-v2.service';
import { CampaignController } from './campaign.controller';

@Module({
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}