import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../../common";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { Injectable } from "@nestjs/common";
import { FindManyAdSetsInsightsDtoSchema } from "src/generated/schemas/find-many-adset-insights.dto.schema";
import { AdSetService } from "src/meta/adset/adset.service";

export const GetManyAdSetInsightsDtoSchema = z.object({ ...FindManyAdSetsInsightsDtoSchema.shape, adset_id: z.string() });
export type GetManyAdSetInsightsDto = z.infer<typeof GetManyAdSetInsightsDtoSchema>;

@Injectable()
export class GetAdSetInsightsTool extends HayleeTool {
    constructor(private metaAdSetService: AdSetService){
        super();
    }

    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: GetManyAdSetInsightsDto, config: RunnableConfig) => {
                const { adset_id, ...rest } = params;
                const result = await this.metaAdSetService.getInsights(params.adset_id, rest, config.configurable?.session);
                return JSON.stringify(result);
            },
            {
                name: 'get_adset_insights',
                description: "Used to get META adset insights",
                schema: GetManyAdSetInsightsDtoSchema 
            }
        );
    }
} 



