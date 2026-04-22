import { Body, Controller, Delete, Get, Param, Patch, Post, Query, } from "@nestjs/common";
import { AdSetService } from "./adset.service";
import { FindManyAdSetDto } from "./dto/find-many.dto";
import { CreateAdSetDto, QueryAdSetDto } from "./dto/create-adset.dto";
import { UpdateAdSetDto } from "./dto/update-adset.dto";
import { FindManyTargetingOptionsDto } from "./dto/find-many-target.dto";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";
import { FindManyAdSetsInsightsDto } from "./dto/find-many-adset-insights.dto";

@Controller('meta/ad-sets')
export class AdSetController {
    constructor(
        private readonly adsetsService: AdSetService
    ) {}

    @Get()
    async findMany(
        @Query() query: FindManyAdSetDto,
        @Session() session: UserSession
    ){
        const data = await this.adsetsService.findMany(
            query,
            session
        );

        return data;
    }

    @Get("search/interests")
    async findManyInterests(
        @Query() query: FindManyTargetingOptionsDto,
        @Session() session: UserSession
    ) {
        const data = await this.adsetsService.searchTargets(query, session);
        return data;
    }



    @Get(":adset_id")
    async findOne(
        @Session() session: UserSession,
        @Param("adset_id") adset_id: string
    ) {
        const data = await this.adsetsService.findOne(adset_id, session);
        return data;
    }

   @Get(":adset_id/insights")
    async getInsights(
        @Param("adset_id") adset_id: string,
        @Session() session: UserSession,
        @Query() query: FindManyAdSetsInsightsDto 
    ) {
        const adset = await this.adsetsService.getInsights(adset_id, query, session);
        return adset;
    }

    @Post()
    async create(
        @Body() payload: CreateAdSetDto,
        @Query() query: QueryAdSetDto ,
        @Session() session: UserSession
    ) {
        const data = await this.adsetsService.create(payload, query, session);
        return data;
    }

    @Patch(":adset_id")
    async update(
        @Param("adset_id") adset_id: string,
        @Body() payload: UpdateAdSetDto,
        @Session() session: UserSession
    ) {
        const data = await this.adsetsService.update(adset_id, payload, session);
        return data;
    }

    @Delete(":adset_id")
    async delete(
        @Param("adset_id") adset_id: string,
        @Session() session: UserSession
    ) {
        const data = await this.adsetsService.delete(adset_id, session);
        return data;
    }


}
