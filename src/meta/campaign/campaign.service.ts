import { Injectable } from "@nestjs/common";
import { MetaCredentialService } from "../credentials/credential.service";
import { AdAccount, Campaign, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { FindManyCampaignDto } from "./dto/find-many.dto";

@Injectable()
export class CampaignService {
    constructor(
        private readonly creds: MetaCredentialService,
    ) {}

    async findMany(query: FindManyCampaignDto) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        const adAccount = new AdAccount(query.ad_account_id, {}, null, api);
        const fields = [
            Campaign.Fields.id,
            Campaign.Fields.name,
            Campaign.Fields.status,
            Campaign.Fields.effective_status,
            Campaign.Fields.daily_budget,
            Campaign.Fields.lifetime_budget,
            Campaign.Fields.start_time,
            Campaign.Fields.stop_time
        ];

        const params = {
            limit: 10,
            ...(query.after ? { after: query.after }: {}),
        }

        const campaigns = await adAccount.getCampaigns(fields, params);
        const data = campaigns.map(c => c.exportData());
        const hasNext = campaigns.hasNext();
        const hasPrev = campaigns.hasPrevious();
        const paging_cursors = {
            before: (hasPrev ? campaigns.paging.cursors.before : null),
            after: (hasNext ? campaigns.paging.cursors.after : null)
        }

        return { 
            data,
            paging_cursors
        }
    }
}
