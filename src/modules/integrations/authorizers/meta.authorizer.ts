import { CallbackIntegrationDto } from "../dto/callback-integration.dto";
import { IAuthorizerOauth } from "../interfaces";
import { ExternalUser, IntegrationType, MetaExternalUser, OAuthToken } from "../types";
import axios, { AxiosInstance } from "axios";
import { FacebookAdsApi, } from 'facebook-nodejs-business-sdk';

const PUBLIC_API_URL = process.env.NODE_ENV === 'local' ? process.env.PUBLIC_API_URL_LOCAL : process.env.PUBLIC_API_URL;

export class MetaAuthorizer implements IAuthorizerOauth {

    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: 'https://graph.facebook.com/v25.0',
        })
    }

    getProvider(): IntegrationType {
        return IntegrationType.META;
    } 

    getAuthorizationURL(): string {
        const params = new URLSearchParams({
            client_id: process.env.META_CLIENT_ID!,
            redirect_uri: `${PUBLIC_API_URL}/api/v1/integrations/callback/${this.getProvider()}`,
            scope: 'ads_management,ads_read,business_management'
        });

        return `https://www.facebook.com/v25.0/dialog/oauth?${params.toString()}`;
    }

    async getUserProfile(token: string): Promise<ExternalUser> {
        const api = new FacebookAdsApi(token);
        const me = await api.call<MetaExternalUser>('GET', ['me'], { fields: 'id,name,email,picture{url}' });
        return {
            id: me.id,
            name: me.name,
            email: me.email,
            avatar: me.picture?.data?.url
        };
    }

    async _exchangeTokenForLongLivedToken(access_token: string): Promise<OAuthToken> {
        const response = await this.client.get<OAuthToken>(`/oauth/access_token`, {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: process.env.META_CLIENT_ID,
                client_secret: process.env.META_CLIENT_SECRET,
                fb_exchange_token: access_token
            }
        });
        // TODO: add error handling
        return response.data;
    }

    async exchangeCodeForToken(payload: CallbackIntegrationDto): Promise<OAuthToken> {
        const response = await this.client.get<OAuthToken>(`/oauth/access_token`, {
            params: {
                client_id: process.env.META_CLIENT_ID,
                redirect_uri: `${PUBLIC_API_URL}/api/v1/integrations/callback/${this.getProvider()}`,
                client_secret: process.env.META_CLIENT_SECRET,
                code: payload.code
            }
        });

        const longLivedToken = await this._exchangeTokenForLongLivedToken(response.data.access_token);
        
        return longLivedToken;

    }    
}
