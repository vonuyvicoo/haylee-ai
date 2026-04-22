import { StructuredTool, tool } from "langchain";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { Injectable } from "@nestjs/common";
import { FindManyAdInsightsDtoSchema } from "@common/generated/schemas/find-many-ad-insights.dto.schema";
import { HayleeTool } from "@modules/agent/common";
import { AdService } from "@modules/meta/ads/ads.service";

export const GetManyAdInsightsDtoSchema = z.object({ ...FindManyAdInsightsDtoSchema.shape, ad_id: z.string() });
export type GetManyAdInsightsDto = z.infer<typeof GetManyAdInsightsDtoSchema>;

@Injectable()
export class GetAdInsightsTool extends HayleeTool {
    constructor(private metaAdService: AdService){
        super();
    }

    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: GetManyAdInsightsDto, config: RunnableConfig) => {
                const { ad_id, ...rest } = params;
                const result = await this.metaAdService.getInsights(params.ad_id, rest, config.configurable?.session);
                return JSON.stringify(result);
            },
            {
                name: 'get_ad_insights',
                description: "Used to get META ad insights",
                schema: GetManyAdInsightsDtoSchema 
            }
        );
    }
} 



