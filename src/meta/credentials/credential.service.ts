import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { IntegrationService } from "src/integrations/integration.service";
import { EncryptionService } from "src/encryption/encryption.service";
import { IntegrationType } from "prisma/generated/prisma";
import { UserSession } from "@thallesp/nestjs-better-auth";
import { Request } from "express";

@Injectable()
export class MetaCredentialService {
    constructor(
        private readonly integrationService: IntegrationService,
        private readonly encryptionService: EncryptionService
    ) {}

    async getToken(session: UserSession, req?: Request) {
        if(!session) throw new UnauthorizedException("No session found.");

        const integration_id = req?.query?.integrationId;
        if(integration_id && typeof integration_id !== 'string') throw new BadRequestException("Invalid integration_id.");

        const credential = await this.integrationService._findOne(
            IntegrationType.META,
            session,
            integration_id
        );

        const token = this.encryptionService.decrypt(credential.access_token!);
        return token;
    }
}
