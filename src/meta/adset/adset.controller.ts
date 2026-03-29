import { Controller, Get, Query } from "@nestjs/common";
import { AdSetService } from "./adset.service";
import { FindManyAdSetDto } from "./dto/find-many.dto";

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
}
