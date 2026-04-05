import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { AdSetService } from "src/meta/adset/adset.service";
import { CreateAdSetDtoSchema, QueryAdSetDtoSchema } from "src/generated/schemas/create-adset.dto.schema";

export const CreateAdSetDto_QueryAdSetDtoSchema = z.object({ ...CreateAdSetDtoSchema.shape, ...QueryAdSetDtoSchema.shape });
export type CreateAdSetDto_QueryAdSetDto = z.infer<typeof CreateAdSetDto_QueryAdSetDtoSchema>;

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
                schema: CreateAdSetDto_QueryAdSetDtoSchema 
            }
        );
    }
} 


