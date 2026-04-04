import { Injectable } from "@nestjs/common";
import { AdAccount, FacebookAdsApi, } from "facebook-nodejs-business-sdk";
import { AdAccountBase, GraphEdgeResponse } from "../types";
import { FindManyAdAccountDto } from "./dto/find-many.dto";
import { MetaCredentialService } from "../credentials/credential.service";
import { UserSession } from "@thallesp/nestjs-better-auth";

@Injectable()
export class AdAccountService {
    constructor(
        private readonly creds: MetaCredentialService
    ) {}

    async findMany(query: FindManyAdAccountDto, session: UserSession) {
        const token = await this.creds.getToken(session);

        const api = new FacebookAdsApi(token);
        const adaccounts = await api.call<GraphEdgeResponse<AdAccountBase>>('GET', ['me', 'adaccounts'], {
            fields: [
                AdAccount.Fields.id,
                AdAccount.Fields.name,
                AdAccount.Fields.currency
            ].join(","),
            ...(query.after ? { after: query.after } : {}),
            limit: 10
        });
        const paging_cursors: Record<string, string> | null | undefined = adaccounts?.paging;

        return {
            data: adaccounts.data,
            paging_cursors
        }
    }

}
