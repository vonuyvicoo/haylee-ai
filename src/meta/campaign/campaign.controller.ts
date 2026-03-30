import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { FindManyCampaignDto } from "./dto/find-many.dto";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";

@Controller('meta/campaigns')
export class CampaignController {
    constructor(
        private readonly campaignService: CampaignService
    ) {}
    
    @Get()
    async findMany(
        @Query() query: FindManyCampaignDto
    ) {
        const campaigns = await this.campaignService.findMany(query);
        return campaigns;
    }

    @Post()
    async create(
        @Query() query: FindManyCampaignDto,
        @Body() payload: CreateCampaignDto
    ) {
        const campaign = await this.campaignService.create(payload, query);
        return campaign;
    }

    @Patch(":campaign_id")
    async update(
        @Param("campaign_id") campaign_id: string,
        @Body() payload: UpdateCampaignDto
    ) {
        const campaign = await this.campaignService.update(campaign_id, payload);
        return campaign;
    }

    @Delete(":campaign_id")
    async delete(
        @Param("campaign_id") campaign_id: string,
    ) {
        const msg = await this.campaignService.delete(campaign_id);
        return msg;
    }
}
