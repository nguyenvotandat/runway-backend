import { Module } from '@nestjs/common';
import { CampaignController } from './presentation/controllers/campaign.controller';
import { CampaignService } from './application/services/campaign.service';
import { CampaignRepository } from './infrastructure/repositories/campaign.repository';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Module({
  controllers: [CampaignController],
  providers: [
    CampaignService,
    {
      provide: 'ICampaignRepository',
      useClass: CampaignRepository
    },
    PrismaService
  ],
  exports: [CampaignService]
})
export class CampaignModule {}