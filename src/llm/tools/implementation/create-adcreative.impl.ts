import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { CreateAdCreativeDtoSchema, QueryAdCreativeDtoSchema } from "src/generated/schemas/create-adcreative.dto.schema";
import { AdCreativeService } from "src/meta/ad-creative/adcreative.service";

export const CreateAdCreativeDto_QueryAdCreativeDtoSchema = z.object({ ...CreateAdCreativeDtoSchema.shape, ...QueryAdCreativeDtoSchema.shape });
export type CreateAdCreativeDto_QueryAdCreativeDto = z.infer<typeof CreateAdCreativeDto_QueryAdCreativeDtoSchema>;

export class CreateAdCreativeTool extends HayleeTool {
    constructor(private metaAdCreativeService: AdCreativeService){
        super();
    }
    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: CreateAdCreativeDto_QueryAdCreativeDto, config: RunnableConfig) => {
                const { ad_account_id, ...rest } = params;
                const result = await this.metaAdCreativeService.create(rest, {
                    ad_account_id
                }, config.configurable?.session);
                return JSON.stringify(result);
            },
            {
                name: 'create_adcreative',
                description: "Used to create a META ad creative. THIS IS NOT FOR CREATING AN IMAGE. BUT RATHER MAKING AN INSTANCE OF AN ADCREATIVE IN META",
                schema: CreateAdCreativeDto_QueryAdCreativeDtoSchema 
            }
        );
    }
} 


