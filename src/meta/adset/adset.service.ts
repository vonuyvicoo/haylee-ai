import { Injectable } from "@nestjs/common";
import { AdAccount, AdSet, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { GraphEdgeResponse } from "../types";
import { MetaCredentialService } from "../credentials/credential.service";
import { FindManyAdSetDto } from "./dto/find-many.dto";
import { CreateAdSetDto, QueryAdSetDto } from "./dto/create-adset.dto";
import { UpdateAdSetDto } from "./dto/update-adset.dto";
import { FindManyTargetingOptionsDto } from "./dto/find-many-target.dto";
import { Interest } from "./types";

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

    async create(payload: CreateAdSetDto, query: QueryAdSetDto) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        const adAccount = new AdAccount(query.ad_account_id, {}, null, api);
        const adset = await adAccount.createAdSet([], {
            [AdSet.Fields.name]: payload.name,
            [AdSet.Fields.status]: payload.status ?? AdSet.Status.paused,
            [AdSet.Fields.campaign_id]: payload.campaign_id,
            [AdSet.Fields.billing_event]: payload.billing_event,
            [AdSet.Fields.optimization_goal]: payload.optimization_goal,
            [AdSet.Fields.targeting]: payload.targeting,
            ...(payload.promoted_object ? { [AdSet.Fields.promoted_object]: payload.promoted_object } : {}),
        });

        return adset;
    }

    async update(id: string, payload: UpdateAdSetDto) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        const adset = new AdSet(id, {}, null, api);
        const updated = await adset.update([], {
            [AdSet.Fields.name]: payload.name,
            [AdSet.Fields.status]: payload.status,
            [AdSet.Fields.billing_event]: payload.billing_event,
            [AdSet.Fields.optimization_goal]: payload.optimization_goal,
            [AdSet.Fields.targeting]: payload.targeting,
            ...(payload.promoted_object ? { [AdSet.Fields.promoted_object]: payload.promoted_object } : {}),
        });

        return updated;
    }

    async delete(id: string) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        //const adAccount = new AdAccount(query.ad_account_id, {}, null, api);
        const adset = new AdSet(id, {}, null, api);
        await adset.delete([]);
        return {
            message: "Deleted successfully."
        };
    }

    async searchTargets(query: FindManyTargetingOptionsDto) {
        const token = await this.creds.getToken();
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
