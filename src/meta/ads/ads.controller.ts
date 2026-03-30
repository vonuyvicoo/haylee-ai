import { Controller, Get, Query } from "@nestjs/common";
import { AdService } from "./ads.service";
import { FindManyAdsDto } from "./dto/find-many.dto";

@Controller('meta/ads')
export class AdController {
    constructor(
        private readonly adService: AdService
    ) {}
    
    @Get()
    async findMany(
        @Query() query: FindManyAdsDto
    ) {
        const ads = await this.adService.findMany(query);
        return ads;
    }
}
