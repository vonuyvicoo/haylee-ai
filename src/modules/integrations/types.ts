export enum CredentialType {
    OAUTH = "OAUTH",
    APIKEY = "APIKEY"
}

export enum IntegrationType {
    META = "META"
    //GMAIL 
}

export type OAuthToken = {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    raw?: any;
}

export type ExternalUser = {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  raw?: any;
};

export type MetaExternalUser = {
    id: string;
    name: string;
    picture?: {
        data?: {
            url?: string;
        }
    },
    email?: string;
}
