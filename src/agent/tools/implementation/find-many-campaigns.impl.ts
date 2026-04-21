import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../../common";
import { CampaignService } from "src/meta/campaign/campaign.service";
import { FindManyCampaignDto } from "src/meta/campaign/dto/find-many.dto";
import { FindManyCampaignDtoSchema } from "src/generated/schemas/find-many.dto.schema";
import { RunnableConfig } from "@langchain/core/runnables";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindManyCampaignsTool extends HayleeTool {
    constructor(private metaCampaignService: CampaignService){
        super();
    }
    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: FindManyCampaignDto, config: RunnableConfig) => {
                const result = await this.metaCampaignService.findMany(params, config.configurable?.session);
                return JSON.stringify(result);
            },
            {
                name: 'find_many_campaigns',
                description: "Used to find campaigns",
                schema: FindManyCampaignDtoSchema 
            }
        );
    }
} 


