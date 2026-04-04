import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { CampaignService } from "src/meta/campaign/campaign.service";
import { FindManyCampaignDto } from "src/meta/campaign/dto/find-many.dto";
import { FindManyCampaignDtoSchema } from "src/generated/schemas/find-many.dto.schema";

export class FindManyCampaignsTool extends HayleeTool {
    constructor(private metaCampaignService: CampaignService){
        super();
    }
    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: FindManyCampaignDto) => {
                const result = await this.metaCampaignService.findMany(params);
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


