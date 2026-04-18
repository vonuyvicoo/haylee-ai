import { Injectable, NotFoundException } from "@nestjs/common";
import { IntegrationType } from "prisma/generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthorizerFactory } from "./authorizers/authorizer.factory";
import { IAuthorizerOauth } from "./interfaces";
import { CallbackIntegrationDto } from "./dto/callback-integration.dto";
import { CredentialType } from "./types";
import { UserSession } from "@thallesp/nestjs-better-auth";
import { EncryptionService } from "src/_shared/utils/encryption/encryption.service";

@Injectable()
export class IntegrationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly encryptionService: EncryptionService
    ) {}
    
    /* Requesting */
    async authorize(
        type: IntegrationType
    ){
        const provider = AuthorizerFactory.create<IAuthorizerOauth>(type);
        return provider.getAuthorizationURL();
    }

    async exchange(
        type: IntegrationType,
        payload: CallbackIntegrationDto,
        session: UserSession
    ) {
        const provider = AuthorizerFactory.create<IAuthorizerOauth>(type);
        const token = await provider.exchangeCodeForToken(payload);
        
        const data = await this.prisma.integration.create({
            data: {
                type,
                name: `${type} Account`,
                credential_type: CredentialType.OAUTH,
                access_token: this.encryptionService.encrypt(token.access_token),
                refresh_token: token.refresh_token ? this.encryptionService.encrypt(token.refresh_token) : null,
                expires_at: new Date(
                    new Date().getTime() + ((token.expires_in || 0) * 1000)).toISOString(),
                owner_id: session.user.id
            }
        });

        return data;
    }

    async getProfile(
        id: string,
        session: UserSession
    ) {
        const credential = await this.prisma.integration.findUniqueOrThrow({
            where: {
                id_owner_id: {
                    id,
                    owner_id: session.user.id
                }
            }
        });

        // TODO: handle APIkey auth
        if(!credential.access_token) throw new NotFoundException("No access token.");

        const token = this.encryptionService.decrypt(credential.access_token);

        const integration = AuthorizerFactory.create<IAuthorizerOauth>(credential.type);
        const profile = integration.getUserProfile(token);
        return profile;
    }
    
    async findMany(
        session: UserSession
    ) {
        const credentials = await this.prisma.integration.findMany({
            where: {
                owner_id: session.user.id
            }, select: {
                name: true,
                id: true,
                type: true,
                credential_type: true,
                created_at: true,
                updated_at: true,
                expires_at: true
            }
        });

        return credentials;
    }
    
    async _findOne(
        // Defining types here for later collab
        /* @param type - The type of integration */ 
        type: IntegrationType,
        /* @param session - The better auth session */ 
        session: UserSession,
        /* @param [id] - Optional preferred ID */
        id?: string,
    ) {
        const credential = await this.prisma.integration.findFirstOrThrow({
            where: {
                type,
                owner_id: session.user.id,
                id
            }
        });

        return credential;
    }
}
