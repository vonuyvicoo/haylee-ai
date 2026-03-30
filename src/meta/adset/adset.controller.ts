import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AdSetService } from "./adset.service";
import { FindManyAdSetDto } from "./dto/find-many.dto";
import { CreateAdSetDto, QueryAdSetDto } from "./dto/create-adset.dto";
import { UpdateAdSetDto } from "./dto/update-adset.dto";
import { FindManyTargetingOptionsDto } from "./dto/find-many-target.dto";
import { FindManyBaseDto } from "../dto/find-many-base.dto";

@Controller('meta/ad-sets')
export class AdSetController {
    constructor(
        private readonly adsetsService: AdSetService
    ) {}

    @Get()
    async findMany(
        @Query() query: FindManyAdSetDto 
    ){
        const data = await this.adsetsService.findMany(
            query,
        );

        return data;
    }

    @Get("search/interests")
    async findManyInterests(
        @Query() query: FindManyTargetingOptionsDto,
    ) {
        const data = await this.adsetsService.searchTargets(query);
        return data;
    }

    @Post()
    async create(
        @Body() payload: CreateAdSetDto,
        @Query() query: QueryAdSetDto 
    ) {
        const data = await this.adsetsService.create(payload, query);
        return data;
    }

    @Patch(":adset_id")
    async update(
        @Param("adset_id") adset_id: string,
        @Body() payload: UpdateAdSetDto
    ) {
        const data = await this.adsetsService.update(adset_id, payload);
        return data;
    }

    @Delete(":adset_id")
    async delete(
        @Param("adset_id") adset_id: string
    ) {
        const data = await this.adsetsService.delete(adset_id);
        return data;
    }


}
