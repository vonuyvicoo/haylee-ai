import { Controller, Get, Query } from "@nestjs/common";
import { AdLibraryService } from "./adlibrary.service";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";
import { FindManyAdsLibraryDto } from "./dto/find-many-ads-library.dto";

@Controller('meta/adlibrary')
export class AdLibraryController {
    constructor(private readonly adlibraryService: AdLibraryService) {}
    
    @Get()
    async findMany(
        @Session() session: UserSession,
        @Query() query: FindManyAdsLibraryDto
    ) {
        const data = await this.adlibraryService.findMany(query, session);
        return { data }
    }
}
