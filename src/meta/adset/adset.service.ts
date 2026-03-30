import { Injectable } from "@nestjs/common";
import { AdAccount, AdSet, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { GraphEdgeResponse } from "../types";
import { MetaCredentialService } from "../credentials/credential.service";
import { FindManyAdSetDto } from "./dto/find-many.dto";

@Injectable()
export class AdSetService {

    constructor(
        private readonly creds: MetaCredentialService
    ) {}
       
    async findMany(
        query: FindManyAdSetDto
    ) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);

        const adaccount = new AdAccount(query.ad_account_id, {}, null, api);
        const fields = [
            AdSet.Fields.id,
            AdSet.Fields.name,
            AdSet.Fields.status,
            AdSet.Fields.effective_status,
            AdSet.Fields.campaign_id,
            AdSet.Fields.daily_budget,
            AdSet.Fields.lifetime_budget,
            AdSet.Fields.start_time,
            AdSet.Fields.end_time
        ];

        const params = {
            limit: 10,
            ...(query.campaign_id ? { 
                filtering: [{
                    field: "campaign.id",
                    operator: "IN",
                    value: [query.campaign_id]
                }]
            } : {}),
            ...(query.after ? { after: query.after } : {})
        }

        const adsets = await adaccount.getAdSets(fields, params, true);
        const data = adsets.map(a => a.exportData());
        const hasNext = adsets.hasNext();
        const hasPrev = adsets.hasPrevious();
        const paging_cursors = {
            before: (hasPrev ? adsets.paging.cursors.before : null),
            after: (hasNext ? adsets.paging.cursors.after : null)
        }

        return { 
            data,
            paging_cursors
        }
        
    }

}
