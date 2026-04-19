import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { AdService } from "src/meta/ads/ads.service";
import { Injectable } from "@nestjs/common";
import { FindManyAdInsightsDtoSchema } from "src/generated/schemas/find-many-ad-insights.dto.schema";

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



