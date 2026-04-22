import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { IntegrationService } from "./integration.service";
import { IntegrationType } from "prisma/generated/prisma";
import { isEnum } from "class-validator";
import { CallbackIntegrationDto } from "./dto/callback-integration.dto";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";

@Controller('integrations')
export class IntegrationController {
    constructor(
        private readonly integrationService: IntegrationService
    ) {}
    
    @Get('authorize/:type')
    async authorize(
        @Param("type") type: IntegrationType
    ) {
        if(!isEnum(type, IntegrationType)) {
            throw new BadRequestException("Invalid integration type.")
        }
        
        const url = await this.integrationService.authorize(type);
        return {
            url
        }
    }

    @Get('callback/:type')
    async exchange(
        @Param("type") type: IntegrationType,
        @Query() callback: CallbackIntegrationDto,
        @Session() session: UserSession
    ) {
        if(!isEnum(type, IntegrationType)) throw new BadRequestException("Invalid Integration type.")

        await this.integrationService.exchange(type, callback, session);

        return {
            message: "Authenticated successfully."
        }
    }

    @Get(':id/profile')
    async getProfile(
        @Param("id") id: string,
        @Session() session: UserSession
    ) {
        const profile = await this.integrationService.getProfile(id, session);

        return profile;
    }

    @Get()
    async findMany(
        @Session() session: UserSession
    ) {
        const credentials = await this.integrationService.findMany(session);
        return credentials;
    }
} 
