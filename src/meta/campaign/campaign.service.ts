import { Injectable } from "@nestjs/common";
import { MetaCredentialService } from "../credentials/credential.service";
import { AdAccount, Campaign, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { BudgetStrategy } from "./dto/create-campaign.dto";
import { FindManyCampaignDto } from "./dto/find-many.dto";
import { CreateCampaignDto, QueryCampaignDto } from "./dto/create-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { UserSession } from "@thallesp/nestjs-better-auth";

@Injectable()
export class CampaignService {
    constructor(
        private readonly creds: MetaCredentialService,
    ) {}

    async findMany(query: FindManyCampaignDto, session: UserSession) {
        const token = await this.creds.getToken(session);
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
            Campaign.Fields.stop_time,
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

   async findOne(id: string, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const campaign = new Campaign(id, {}, null, api);
        const campaign_meta = await campaign.get([
            Campaign.Fields.name,
            Campaign.Fields.status,
            Campaign.Fields.objective,
            'is_adset_budget_sharing_enabled',
            Campaign.Fields.daily_budget,
            Campaign.Fields.lifetime_budget
        ], {
        });
        const data = campaign_meta.exportAllData();
        return {
            data
        };
    }



    async create(payload: CreateCampaignDto, query: QueryCampaignDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const adAccount = new AdAccount(query.ad_account_id, {}, null, api);
        const isCBO = payload.strategy === BudgetStrategy.CAMPAIGN_BUDGET;
        const campaign = await adAccount.createCampaign([], {
            [Campaign.Fields.name]: payload.name,
            [Campaign.Fields.status]: Campaign.Status.paused,
            [Campaign.Fields.objective]: payload.objective,
            [Campaign.Fields.special_ad_categories]: payload.special_ad_categories,
            [Campaign.Fields.bid_strategy]: payload.bid_strategy,
            ...(!isCBO ? { ['is_adset_budget_sharing_enabled']: payload.is_adset_budget_sharing_enabled ?? false } : {}),
            ...(isCBO && payload.daily_budget    ? { [Campaign.Fields.daily_budget]:    payload.daily_budget    * 100 } : {}),
            ...(isCBO && payload.lifetime_budget ? { [Campaign.Fields.lifetime_budget]: payload.lifetime_budget * 100 } : {}),
        });

        return campaign;
    }

    async update(id: string, payload: UpdateCampaignDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const campaign = new Campaign(id, {}, null, api);
        const isCBO = payload.strategy === BudgetStrategy.CAMPAIGN_BUDGET;
        const updated = await campaign.update([], {
            [Campaign.Fields.name]: payload.name,
            [Campaign.Fields.status]: payload.status,
            [Campaign.Fields.objective]: payload.objective,
            ...(payload.strategy !== undefined && !isCBO
                ? { ['is_adset_budget_sharing_enabled']: payload.is_adset_budget_sharing_enabled ?? false }
                : {}),
            ...(payload.daily_budget    ? { [Campaign.Fields.daily_budget]:    payload.daily_budget    * 100 } : {}),
            ...(payload.lifetime_budget ? { [Campaign.Fields.lifetime_budget]: payload.lifetime_budget * 100 } : {}),
        });
        return updated;
    }

    async delete(id: string, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        //const adAccount = new AdAccount(query.ad_account_id, {}, null, api);
        const campaign = new Campaign(id, {}, null, api);
        await campaign.delete([]);
        return {
            message: "Deleted successfully."
        };
    }
}
