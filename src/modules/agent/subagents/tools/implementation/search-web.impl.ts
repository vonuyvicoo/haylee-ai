import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../../../common";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { Injectable } from "@nestjs/common";

export const SearchWebSchema = z.object({
    query: z.string()
});

export type SearchWebParams = z.infer<typeof SearchWebSchema>;
/*
@Injectable()
export class SearchWebTool extends HayleeTool {
    constructor(){
        super();
    }

    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: SearchWebParams, config: RunnableConfig) => {
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


*/
