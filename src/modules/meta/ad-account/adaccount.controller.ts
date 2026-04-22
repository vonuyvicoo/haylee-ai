import { Controller, Get, Query, } from "@nestjs/common";
import { AdAccountService } from "./adaccount.service";
import { FindManyAdAccountDto } from "./dto/find-many.dto";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";

// I believe we only need listing of ad accounts?
// Can just add later


@Controller('meta/ad-accounts')
export class AdAccountController {
    constructor(
        private readonly adAccountService: AdAccountService
    ) {}

    @Get()
    async findMany(
        @Query() query: FindManyAdAccountDto,
        @Session() session: UserSession // moving forward we won't make this request scoped and instead just inject the session
    ){
        const data = await this.adAccountService.findMany(
            query,
            session
        );

        return data;
    }
}
