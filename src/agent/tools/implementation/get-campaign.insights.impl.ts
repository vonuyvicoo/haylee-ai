import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { Injectable } from "@nestjs/common";
import { FindManyCampaignInsightsDtoSchema } from "src/generated/schemas/find-many-campaign-insights.dto.schema";
import { CampaignService } from "src/meta/campaign/campaign.service";

export const GetManyCampaignInsightsDtoSchema = z.object({ ...FindManyCampaignInsightsDtoSchema.shape, campaign_id: z.string() });
export type GetManyCampaignInsightsDto = z.infer<typeof GetManyCampaignInsightsDtoSchema>;

@Injectable()
export class GetCampaignInsightsTool extends HayleeTool {
    constructor(private metaCampaignService: CampaignService){
        super();
    }

    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: GetManyCampaignInsightsDto, config: RunnableConfig) => {
                const { campaign_id, ...rest } = params;
                const result = await this.metaCampaignService.getInsights(params.campaign_id, rest, config.configurable?.session);
                return JSON.stringify(result);
            },
            {
                name: 'get_campaign_insights',
                description: "Used to get META campaign insights",
                schema: GetManyCampaignInsightsDtoSchema 
            }
        );
    }
} 



