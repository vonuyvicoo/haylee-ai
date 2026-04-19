import { Injectable, BadRequestException } from "@nestjs/common";
import { AdAccount, AdSet, AdsInsights, Campaign, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { GraphEdgeResponse } from "../types";
import { MetaCredentialService } from "../credentials/credential.service";
import { FindManyAdSetDto } from "./dto/find-many.dto";
import { CreateAdSetDto, QueryAdSetDto } from "./dto/create-adset.dto";
import { BudgetStrategy } from "../campaign/dto/create-campaign.dto";
import { UpdateAdSetDto } from "./dto/update-adset.dto";
import { FindManyTargetingOptionsDto } from "./dto/find-many-target.dto";
import { Interest } from "./types";
import { UserSession } from "@thallesp/nestjs-better-auth";
import { FindManyAdSetsInsightsDto } from "./dto/find-many-adset-insights.dto";

@Injectable()
export class AdSetService {

    constructor(
        private readonly creds: MetaCredentialService
    ) {}
       
    async findMany(
        query: FindManyAdSetDto,
        session: UserSession
    ) {
        const token = await this.creds.getToken(session);
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

    async findOne(id: string, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const adset = new AdSet(id, {}, null, api);
        const adset_meta = await adset.get([
            AdSet.Fields.name,
            AdSet.Fields.status,
            AdSet.Fields.billing_event,
            AdSet.Fields.optimization_goal,
            AdSet.Fields.targeting,
            AdSet.Fields.start_time,
            AdSet.Fields.end_time,
            AdSet.Fields.daily_budget,
            AdSet.Fields.lifetime_budget,
            AdSet.Fields.promoted_object,
            AdSet.Fields.campaign_id
        ], {
        });

        const data = adset_meta.exportAllData();

        return {
            data
        };
    }

   async getInsights(id: string, query: FindManyAdSetsInsightsDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const adset = new AdSet(id, {}, null, api);

        const fields = [
            AdsInsights.Fields.spend,
            AdsInsights.Fields.adset_id,
            AdsInsights.Fields.adset_name,
            AdsInsights.Fields.impressions,
            AdsInsights.Fields.cpc,
            AdsInsights.Fields.cpm,
            AdsInsights.Fields.cpp,
            AdsInsights.Fields.ctr,
            AdsInsights.Fields.unique_ctr,
            AdsInsights.Fields.unique_clicks,
            AdsInsights.Fields.cost_per_unique_click,
            AdsInsights.Fields.cost_per_unique_conversion,
            AdsInsights.Fields.cost_per_result,
            AdsInsights.Fields.reach,
            AdsInsights.Fields.results,
        ];
        const params = {
            level: 'adset',
            date_preset: query.date_preset,
        };

        const insights = await adset.getInsights(fields, params);
        const data = insights.map(c => c.exportData());
        const hasNext = insights.hasNext();
        const hasPrev = insights.hasPrevious();
        const paging_cursors = {
            before: (hasPrev ? insights.paging.cursors.before : null),
            after: (hasNext ? insights.paging.cursors.after : null)
        }

        return { 
            data,
            paging_cursors
        }
    }




    async create(payload: CreateAdSetDto, query: QueryAdSetDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);

        // Guard: CBO adsets require the parent campaign to have a campaign-level budget
        if (payload.strategy === BudgetStrategy.CAMPAIGN_BUDGET) {
            const parentCampaign = new Campaign(payload.campaign_id, {}, null, api);
            const campaignData = await parentCampaign.get([
                Campaign.Fields.daily_budget,
                Campaign.Fields.lifetime_budget,
            ]);
            const hasCampaignBudget = campaignData[Campaign.Fields.daily_budget] || campaignData[Campaign.Fields.lifetime_budget];
            if (!hasCampaignBudget) {
                throw new BadRequestException(
                    'The selected campaign does not have a campaign-level budget (CBO). ' +
                    'Set a budget on the campaign first, or switch to Ad Set Budget (ABO) and provide a budget here.'
                );
            }
        }

        const adAccount = new AdAccount(query.ad_account_id, {}, null, api);
        const adset = await adAccount.createAdSet([], {
            [AdSet.Fields.name]: payload.name,
            [AdSet.Fields.status]: payload.status ?? AdSet.Status.paused,
            [AdSet.Fields.campaign_id]: payload.campaign_id,
            [AdSet.Fields.billing_event]: payload.billing_event,
            [AdSet.Fields.optimization_goal]: payload.optimization_goal,
            [AdSet.Fields.targeting]: payload.targeting,
            [AdSet.Fields.start_time]: payload.start_time,
            [AdSet.Fields.end_time]: payload.end_time,
            ...(payload.daily_budget ? { [AdSet.Fields.daily_budget]: payload.daily_budget * 100 } : {}),
            ...(payload.lifetime_budget ? { [AdSet.Fields.lifetime_budget]: payload.lifetime_budget * 100 } : {}),
            ...(payload.promoted_object ? { [AdSet.Fields.promoted_object]: payload.promoted_object } : {}),
        });

        return adset;
    }

    async update(id: string, payload: UpdateAdSetDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const adset = new AdSet(id, {}, null, api);
        const updated = await adset.update([], {
            [AdSet.Fields.name]: payload.name,
            [AdSet.Fields.status]: payload.status,
            [AdSet.Fields.billing_event]: payload.billing_event,
            [AdSet.Fields.optimization_goal]: payload.optimization_goal,
            [AdSet.Fields.targeting]: payload.targeting,
            [AdSet.Fields.start_time]: payload.start_time,
            [AdSet.Fields.end_time]: payload.end_time,
            ...(payload.daily_budget ? { [AdSet.Fields.daily_budget]: payload.daily_budget * 100 } : {}),
            ...(payload.lifetime_budget ? { [AdSet.Fields.lifetime_budget]: payload.lifetime_budget * 100 } : {}),
            ...(payload.promoted_object ? { [AdSet.Fields.promoted_object]: payload.promoted_object } : {}),
        });

        return updated;
    }

    async delete(id: string, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        //const adAccount = new AdAccount(query.ad_account_id, {}, null, api);
        const adset = new AdSet(id, {}, null, api);
        await adset.delete([]);
        return {
            message: "Deleted successfully."
        };
    }

    async searchTargets(query: FindManyTargetingOptionsDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);

        const targets = await api.call<GraphEdgeResponse<Interest>>("GET", ["search"], {
            ...(query.type ? { type: query.type } : {}),
            ...(query.class ? { class: query.class } : {}),
            q: query.query
        });
        const paging_cursors: Record<string, string> | null | undefined = targets?.paging;

        return {
            data: targets.data,
            paging_cursors
        }

    }


}
