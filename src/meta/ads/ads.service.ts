import { Injectable, } from "@nestjs/common";
import { MetaCredentialService } from "../credentials/credential.service";
import { FindManyAdsDto } from "./dto/find-many.dto";
import { AdAccount, Ad, FacebookAdsApi } from "facebook-nodejs-business-sdk";

@Injectable()
export class AdService {
    constructor(
        private readonly creds: MetaCredentialService
    ) {} 

    async findMany(
        query: FindManyAdsDto
    ) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);

        const adaccount = new AdAccount(query.ad_account_id, {}, null, api);
        const fields = [
            Ad.Fields.id,
            Ad.Fields.name,
            //Ad.Fields.creative,
            Ad.Fields.status,
            Ad.Fields.effective_status,
            Ad.Fields.adset_id,
            Ad.Fields.ad_schedule_start_time,
            Ad.Fields.ad_schedule_end_time,
            'creative{id,thumbnail_url}',
            
        ];

        const params = {
            limit: 10,
            ...(query.ad_set_id ? { 
                filtering: [{
                    field: "adset.id",
                    operator: "IN",
                    value: [query.ad_set_id]
                }]
            } : {}),
            ...(query.after ? { after: query.after } : {})
        }

        const ads = await adaccount.getAds(fields, params, true);
        const data = ads.map(a => a.exportData());
        const hasNext = ads.hasNext();
        const hasPrev = ads.hasPrevious();
        const paging_cursors = {
            before: (hasPrev ? ads.paging.cursors.before : null),
            after: (hasNext ? ads.paging.cursors.after : null)
        }

        return {
            data,
            paging_cursors
        }

    }
}
