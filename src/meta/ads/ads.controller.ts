import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AdService } from "./ads.service";
import { FindManyAdsDto } from "./dto/find-many.dto";
import { CreateAdDto, QueryAdDto, UpdateAdDto } from "./dto/create-ad.dto";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";

@Controller('meta/ads')
export class AdController {
    constructor(private readonly adService: AdService) {}

    @Get()
    async findMany(
        @Query() query: FindManyAdsDto,
        @Session() session: UserSession
    ) {
        return this.adService.findMany(query, session);
    }

    @Post()
    async create(
        @Query() query: QueryAdDto,
        @Body() payload: CreateAdDto,
        @Session() session: UserSession
    ) {
        return this.adService.create(payload, query, session);
    }

    @Patch(":ad_id")
    async update(
        @Param("ad_id") ad_id: string,
        @Body() payload: UpdateAdDto,
        @Session() session: UserSession
    ) {
        return this.adService.update(ad_id, payload, session);
    }

    @Delete(":ad_id")
    async delete(
        @Param("ad_id") ad_id: string,
        @Session() session: UserSession
    ) {
        return this.adService.delete(ad_id, session);
    }
}
