import { Injectable } from "@nestjs/common";
import { MetaCredentialService } from "../credentials/credential.service";
import { FindManyAdsDto } from "./dto/find-many.dto";
import { Ad, AdAccount, AdsInsights, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { CreateAdDto, QueryAdDto, UpdateAdDto } from "./dto/create-ad.dto";
import { UserSession } from "@thallesp/nestjs-better-auth";
import { FindManyAdInsightsDto } from "./dto/find-many-ad-insights.dto";

@Injectable()
export class AdService {
    constructor(
        private readonly creds: MetaCredentialService
    ) {}

    async findMany(query: FindManyAdsDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);

        const adaccount = new AdAccount(query.ad_account_id, {}, null, api);
        const fields = [
            Ad.Fields.id,
            Ad.Fields.name,
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
        };

        const ads = await adaccount.getAds(fields, params, true);
        const data = ads.map(a => a.exportData());
        const hasNext = ads.hasNext();
        const hasPrev = ads.hasPrevious();
        const paging_cursors = {
            before: hasPrev ? ads.paging.cursors.before : null,
            after: hasNext ? ads.paging.cursors.after : null,
        };

        return { data, paging_cursors };
    }

    async getInsights(id: string, query: FindManyAdInsightsDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const ad = new Ad(id, {}, null, api);

        const fields = [
            AdsInsights.Fields.spend,
            AdsInsights.Fields.ad_id,
            AdsInsights.Fields.ad_name,
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
            level: 'ad',
            date_preset: query.date_preset,
        };

        const insights = await ad.getInsights(fields, params);
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


    async create(payload: CreateAdDto, query: QueryAdDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const adAccount = new AdAccount(query.ad_account_id, {}, null, api);
        const ad = await adAccount.createAd([], {
            [Ad.Fields.name]: payload.name,
            [Ad.Fields.adset_id]: payload.adset_id,
            [Ad.Fields.status]: payload.status ?? Ad.Status.paused,
            creative: { creative_id: payload.creative_id },
        });

        return ad;
    }

    async update(id: string, payload: UpdateAdDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const ad = new Ad(id, {}, null, api);
        const updated = await ad.update([], {
            ...(payload.name ? { [Ad.Fields.name]: payload.name } : {}),
            ...(payload.status ? { [Ad.Fields.status]: payload.status } : {}),
        });
        return updated;
    }

    async delete(id: string, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const ad = new Ad(id, {}, null, api);
        await ad.delete([]);
        return { message: "Deleted successfully." };
    }
}
