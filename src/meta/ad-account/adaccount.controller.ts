import { Controller, Get, Query } from "@nestjs/common";
import { AdAccountService } from "./adaccount.service";
import { FindManyAdAccountDto } from "./dto/find-many.dto";

// I believe we only need listing of ad accounts?
// Can just add later


@Controller('meta/ad-accounts')
export class AdAccountController {
    constructor(
        private readonly adAccountService: AdAccountService
    ) {}

    @Get()
    async findMany(
        @Query() query: FindManyAdAccountDto
    ){
        const data = await this.adAccountService.findMany(
            query,
        );

        return data;
    }
}
