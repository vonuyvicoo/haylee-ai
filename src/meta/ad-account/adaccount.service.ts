import { Injectable } from "@nestjs/common";
import { FacebookAdsApi, } from "facebook-nodejs-business-sdk";
import { AdAccountBase, GraphEdgeResponse } from "../types";
import { FindManyAdAccountDto } from "./dto/find-many.dto";
import { MetaCredentialService } from "../credentials/credential.service";

@Injectable()
export class AdAccountService {
    constructor(
        private readonly creds: MetaCredentialService
    ) {}

    async findMany(query: FindManyAdAccountDto) {
        const token = await this.creds.getToken();

        const api = new FacebookAdsApi(token);
        const adaccounts = await api.call<GraphEdgeResponse<AdAccountBase>>('GET', ['me', 'adaccounts'], {
            fields: 'id,name',
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
