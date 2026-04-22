import { CallbackIntegrationDto } from "./dto/callback-integration.dto";
import { ExternalUser, IntegrationType, OAuthToken } from "./types";

export interface IAuthorizerBase {
    getProvider(): IntegrationType;
    getUserProfile(token: string): Promise<ExternalUser>
}

export interface IAuthorizerOauth extends IAuthorizerBase {
    getAuthorizationURL(): string;
    exchangeCodeForToken(payload: CallbackIntegrationDto): Promise<OAuthToken>;
}

export interface IAuthorizerAPIKey extends IAuthorizerBase {}
