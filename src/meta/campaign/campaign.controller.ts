import { Controller, Get, Query } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { FindManyCampaignDto } from "./dto/find-many.dto";

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
}
