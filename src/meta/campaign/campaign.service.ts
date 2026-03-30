import { Injectable } from "@nestjs/common";
import { MetaCredentialService } from "../credentials/credential.service";
import { AdAccount, Campaign, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { FindManyCampaignDto } from "./dto/find-many.dto";
import { CreateCampaignDto, QueryCampaignDto } from "./dto/create-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";

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


    async create(payload: CreateCampaignDto, query: QueryCampaignDto) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        const adAccount = new AdAccount(query.ad_account_id, {}, null, api);
        const campaign = await adAccount.createCampaign([], {
            [Campaign.Fields.name]: payload.name,
            [Campaign.Fields.status]: Campaign.Status.paused,
            [Campaign.Fields.objective]: payload.objective,
            [Campaign.Fields.special_ad_categories]: payload.special_ad_categories,
            [Campaign.Fields.bid_strategy]: payload.bid_strategy,
            [Campaign.Fields.daily_budget]: payload.daily_budget,
            [Campaign.Fields.lifetime_budget]: payload.lifetime_budget,
            ["is_adset_budget_sharing_enabled"]: payload.is_adset_budget_sharing_enabled,
        });

        return campaign;
    }

    async update(id: string, payload: UpdateCampaignDto) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        const campaign = new Campaign(id, {}, null, api);
        const updated = await campaign.update([], {
            [Campaign.Fields.name]: payload.name,
            [Campaign.Fields.status]: payload.status,
            [Campaign.Fields.objective]: payload.objective
        });
        return updated;
    }

    async delete(id: string) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        //const adAccount = new AdAccount(query.ad_account_id, {}, null, api);
        const campaign = new Campaign(id, {}, null, api);
        await campaign.delete([]);
        return {
            message: "Deleted successfully."
        };
    }
}
