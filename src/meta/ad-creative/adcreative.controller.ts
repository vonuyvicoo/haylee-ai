import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AdCreativeService } from "./adcreative.service";
import { CreateAdCreativeDto, QueryAdCreativeDto } from "./dto/create-adcreative.dto";
import { UpdateAdCreativeDto } from "./dto/update-adcreative.dto";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";

@Controller('meta/ad-creatives')
export class AdCreativeController {
    constructor(private readonly adCreativeService: AdCreativeService) {}

    @Get()
    async findMany(
        @Query() query: QueryAdCreativeDto,
        @Session() session: UserSession
    ) {
        return this.adCreativeService.findMany(query, session);
    }

    @Post()
    async create(
        @Query() query: QueryAdCreativeDto,
        @Body() payload: CreateAdCreativeDto,
        @Session() session: UserSession
    ) {
        return this.adCreativeService.create(payload, query, session);
    }

    @Patch(":creative_id")
    async update(
        @Param("creative_id") creative_id: string,
        @Body() payload: UpdateAdCreativeDto,
        @Session() session: UserSession
    ) {
        return this.adCreativeService.update(creative_id, payload, session);
    }

    @Delete(":creative_id")
    async delete(
        @Param("creative_id") creative_id: string,
        @Session() session: UserSession
    ) {
        return this.adCreativeService.delete(creative_id, session);
    }

    @Post("images")
    @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 } }))
    async uploadImage(
        @Query("ad_account_id") ad_account_id: string,
        @UploadedFile() file: Express.Multer.File,
        @Session() session: UserSession
    ) {
        return this.adCreativeService.uploadImage(ad_account_id, file, session);
    }
}
