import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { AdSetService } from "src/meta/adset/adset.service";
import { CreateAdSetDtoSchema, QueryAdSetDtoSchema } from "src/generated/schemas/create-adset.dto.schema";
import { Refine } from "src/_shared";
import { BudgetStrategy } from "src/meta/campaign/dto/create-campaign.dto";
import { GOAL_TO_BILLING } from "src/_shared/constants";

export const CreateAdSetDto_QueryAdSetDtoSchema = z.object({ ...CreateAdSetDtoSchema.shape, ...QueryAdSetDtoSchema.shape });
export type CreateAdSetDto_QueryAdSetDto = z.infer<typeof CreateAdSetDto_QueryAdSetDtoSchema>;

export const CreateAdSetRefinement: Refine<CreateAdSetDto_QueryAdSetDto> = (v, ctx) => {
    const hasDaily = !!v.daily_budget;
    const hasLifetime = !!v.lifetime_budget;
    if(v.strategy === BudgetStrategy.ADSET_BUDGET) {
        if(hasDaily === hasLifetime) {
            ctx.addIssue({
                code: "custom",
                path: ["daily_budget", "lifetime_budget"],
                message: "ABO requires either daily_budget or lifetime_budget on the ad set but NOT BOTH"
            });
        }
    } else if(v.strategy === BudgetStrategy.CAMPAIGN_BUDGET) {
        if(hasDaily || hasLifetime) {
            ctx.addIssue({
                code: "custom",
                path: ["daily_budget", "lifetime_budget"],
                message: "CBO requires NO daily_budget or lifetime_budget to be set on the Ad Set"
            })
        }
    }

    const validBilling = GOAL_TO_BILLING[v.optimization_goal];
    if(validBilling && !validBilling.includes(v.billing_event)) {
        ctx.addIssue({
            code: "custom",
            path: ["billing_event"],
            message: `billing_event must be one of [${validBilling.join(", ")}] for optimization_goal ${v.optimization_goal}`
        })
    }
}



export class CreateAdSetTool extends HayleeTool {
    constructor(private metaAdSetService: AdSetService){
        super();
    }
    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: CreateAdSetDto_QueryAdSetDto, config: RunnableConfig) => {
                const { ad_account_id, ...rest } = params;
                const result = await this.metaAdSetService.create(rest, {
                    ad_account_id
                }, config.configurable?.session);
                return JSON.stringify(result);
            },
            {
                name: 'create_adset',
                description: "Used to create a META adset",
                schema: CreateAdSetDto_QueryAdSetDtoSchema.superRefine(CreateAdSetRefinement)
            }
        );
    }
} 


