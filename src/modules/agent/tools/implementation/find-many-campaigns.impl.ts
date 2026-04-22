import { StructuredTool, tool } from "langchain";
import { RunnableConfig } from "@langchain/core/runnables";
import { Injectable } from "@nestjs/common";
import { HayleeTool } from "@modules/agent/common";
import { CampaignService } from "@modules/meta/campaign/campaign.service";
import { FindManyCampaignDto } from "@modules/meta/campaign/dto/find-many.dto";
import { FindManyCampaignDtoSchema } from "@common/generated/schemas/find-many.dto.schema";

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


