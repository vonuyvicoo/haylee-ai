import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AdService } from "./ads.service";
import { FindManyAdsDto } from "./dto/find-many.dto";
import { CreateAdDto, QueryAdDto, UpdateAdDto } from "./dto/create-ad.dto";

@Controller('meta/ads')
export class AdController {
    constructor(private readonly adService: AdService) {}

    @Get()
    async findMany(@Query() query: FindManyAdsDto) {
        return this.adService.findMany(query);
    }

    @Post()
    async create(
        @Query() query: QueryAdDto,
        @Body() payload: CreateAdDto
    ) {
        return this.adService.create(payload, query);
    }

    @Patch(":ad_id")
    async update(
        @Param("ad_id") ad_id: string,
        @Body() payload: UpdateAdDto
    ) {
        return this.adService.update(ad_id, payload);
    }

    @Delete(":ad_id")
    async delete(@Param("ad_id") ad_id: string) {
        return this.adService.delete(ad_id);
    }
}
