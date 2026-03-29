import { Inject, Injectable, Scope, UnauthorizedException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { MetaRequestContext } from "../interceptors/meta.context";
import { IntegrationService } from "src/integrations/integration.service";
import { EncryptionService } from "src/encryption/encryption.service";
import { IntegrationType } from "prisma/generated/prisma";
import { UserSession } from "@thallesp/nestjs-better-auth";

@Injectable({ scope: Scope.REQUEST })
export class MetaCredentialService {
    constructor(
        @Inject(REQUEST) private readonly req: Request,
        private readonly ctx: MetaRequestContext,
        private readonly integrationService: IntegrationService,
        private readonly encryptionService: EncryptionService
    ) {}

    async getToken() {
        const session: UserSession = (this.req as any).session;
        if(!session) throw new UnauthorizedException("No session found.");

        const integration_id = this.ctx.integrationId;

        const credential = await this.integrationService._findOne(
            IntegrationType.META,
            session,
            integration_id
        );

        const token = this.encryptionService.decrypt(credential.access_token!);
        return token;
    }
}
