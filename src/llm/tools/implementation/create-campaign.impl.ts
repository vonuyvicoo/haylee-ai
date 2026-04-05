import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { CampaignService } from "src/meta/campaign/campaign.service";
import { RunnableConfig } from "@langchain/core/runnables";
import { CreateCampaignDtoSchema, QueryCampaignDtoSchema } from "src/generated/schemas/create-campaign.dto.schema";
import z from "zod";

export const CreateCampaignDto_QueryCampaignDtoSchema = z.object({ ...CreateCampaignDtoSchema.shape, ...QueryCampaignDtoSchema.shape });
export type CreateCampaignDto_QueryCampaignDto = z.infer<typeof CreateCampaignDto_QueryCampaignDtoSchema>;

export class CreateCampaignTool extends HayleeTool {
    constructor(private metaCampaignService: CampaignService){
        super();
    }
    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: CreateCampaignDto_QueryCampaignDto, config: RunnableConfig) => {
                const { ad_account_id, ...rest } = params;
                const result = await this.metaCampaignService.create(rest, {
                    ad_account_id
                }, config.configurable?.session);
                return JSON.stringify(result);
            },
            {
                name: 'create_campaign',
                description: "Used to create a META campaign",
                schema: CreateCampaignDto_QueryCampaignDtoSchema
            }
        );
    }
} 


