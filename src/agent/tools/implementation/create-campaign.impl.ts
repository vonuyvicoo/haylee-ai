import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { CampaignService } from "src/meta/campaign/campaign.service";
import { RunnableConfig } from "@langchain/core/runnables";
import { CreateCampaignDtoSchema, QueryCampaignDtoSchema } from "src/generated/schemas/create-campaign.dto.schema";
import z from "zod";
import { BudgetStrategy } from "src/meta/campaign/dto/create-campaign.dto";
import { Refine } from "src/_shared";
import { Injectable } from "@nestjs/common";

export const CreateCampaignDto_QueryCampaignDtoSchema = z.object({ ...CreateCampaignDtoSchema.shape, ...QueryCampaignDtoSchema.shape });
export type CreateCampaignDto_QueryCampaignDto = z.infer<typeof CreateCampaignDto_QueryCampaignDtoSchema>;

export const CreateCampaignRefinement: Refine<CreateCampaignDto_QueryCampaignDto> = (v, ctx) => {
    const hasDaily = !!v.daily_budget;
    const hasLifetime = !!v.lifetime_budget;
    if(v.strategy === BudgetStrategy.CAMPAIGN_BUDGET) {
        if(hasDaily === hasLifetime) {
            ctx.addIssue({
                code: "custom",
                path: ["daily_budget", "lifetime_budget"],
                message: "CBO requires daily_budget or lifetime_budget to be present. But not BOTH."
            })
        }
    } else if (v.strategy === BudgetStrategy.ADSET_BUDGET){
        if(hasDaily || hasLifetime) {
            ctx.addIssue({
                code: "custom",
                path: ["daily_budget", "lifetime_budget"],
                message: "ABO campaigns must NOT set a campaign-level budget. This is managed on the adset."
            })
        }
    }
}

@Injectable()
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
                schema: CreateCampaignDto_QueryCampaignDtoSchema.superRefine(CreateCampaignRefinement)
            }
        );
    }
} 


