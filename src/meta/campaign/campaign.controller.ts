import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { FindManyCampaignDto } from "./dto/find-many.dto";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";
import { FindManyCampaignInsightsDto } from "./dto/find-many-campaign-insights.dto";

@Controller('meta/campaigns')
export class CampaignController {
    constructor(
        private readonly campaignService: CampaignService
    ) {}
    
    @Get()
    async findMany(
        @Query() query: FindManyCampaignDto,
        @Session() session: UserSession
    ) {
        const campaigns = await this.campaignService.findMany(query, session);
        return campaigns;
    }

    @Post()
    async create(
        @Query() query: FindManyCampaignDto,
        @Body() payload: CreateCampaignDto,
        @Session() session: UserSession
    ) {
        const campaign = await this.campaignService.create(payload, query, session);
        return campaign;
    }

    @Get(":campaign_id")
    async findOne(
        @Param("campaign_id") campaign_id: string,
        @Session() session: UserSession
    ) {
        const campaign = await this.campaignService.findOne(campaign_id, session);
        return campaign;
    }

   @Get(":campaign_id/insights")
    async getInsights(
        @Param("campaign_id") campaign_id: string,
        @Session() session: UserSession,
        @Query() query: FindManyCampaignInsightsDto
    ) {
        const campaign = await this.campaignService.getInsights(campaign_id, query, session);
        return campaign;
    }


    @Patch(":campaign_id")
    async update(
        @Param("campaign_id") campaign_id: string,
        @Body() payload: UpdateCampaignDto,
        @Session() session: UserSession
    ) {
        const campaign = await this.campaignService.update(campaign_id, payload, session);
        return campaign;
    }

    @Delete(":campaign_id")
    async delete(
        @Param("campaign_id") campaign_id: string,
        @Session() session: UserSession
    ) {
        const msg = await this.campaignService.delete(campaign_id, session);
        return msg;
    }
}
