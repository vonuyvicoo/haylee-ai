import { StructuredTool, tool } from "langchain";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { Injectable } from "@nestjs/common";
import { HayleeTool } from "@modules/agent/common";
import { CampaignService } from "@modules/meta/campaign/campaign.service";
import { FindManyCampaignInsightsDtoSchema } from "@common/generated/schemas/find-many-campaign-insights.dto.schema";

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



