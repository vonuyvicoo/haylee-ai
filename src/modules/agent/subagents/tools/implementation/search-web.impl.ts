import { StructuredTool, tool } from "langchain";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { Injectable } from "@nestjs/common";
import { SearchService } from "@common/utils/search/search.service";
import { HayleeTool } from "@modules/agent/common";

export const SearchWebSchema = z.object({
    query: z.string()
});

export type SearchWebParams = z.infer<typeof SearchWebSchema>;

@Injectable()
export class SearchWebTool extends HayleeTool {
    constructor(private readonly searchService: SearchService){
        super();
    }

    getStructuredTool(): StructuredTool {
        return tool(
            async (params: SearchWebParams, config: RunnableConfig) => {
                const result = await this.searchService.search(params.query);
                return JSON.stringify(result);
            },
            {
                name: 'search_web',
                description: "Used to search web",
                schema: SearchWebSchema 
            }
        );
    }
} 


