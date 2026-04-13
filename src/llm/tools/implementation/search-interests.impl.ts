import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { FindManyTargetingOptionsDtoSchema } from "src/generated/schemas/find-many-target.dto.schema";
import { AdSetService } from "src/meta/adset/adset.service";
import { Injectable } from "@nestjs/common";

export type SearchInterestsDto = z.infer<typeof FindManyTargetingOptionsDtoSchema>;

@Injectable()
export class SearchInterestsTool extends HayleeTool {
    constructor(private adSetService: AdSetService){
        super();
    }
    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: SearchInterestsDto, config: RunnableConfig) => {
                const result = await this.adSetService.searchTargets(params, config.configurable?.session);
                return JSON.stringify(result);
            },
            {
                name: 'search_interests',
                description: "Search Meta insterest. REQUIRED for creating adsets",
                schema: FindManyTargetingOptionsDtoSchema
            }
        );
    }
} 


