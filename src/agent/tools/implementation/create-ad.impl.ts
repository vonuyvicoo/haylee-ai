import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { AdService } from "src/meta/ads/ads.service";
import { CreateAdDtoSchema, QueryAdDtoSchema } from "src/generated/schemas/create-ad.dto.schema";
import { Injectable } from "@nestjs/common";

export const CreateAdDto_QueryAdDtoSchema = z.object({ ...CreateAdDtoSchema.shape, ...QueryAdDtoSchema.shape });
export type CreateAdDto_QueryAdDto = z.infer<typeof CreateAdDto_QueryAdDtoSchema>;

@Injectable()
export class CreateAdTool extends HayleeTool {
    constructor(private metaAdService: AdService){
        super();
    }

    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: CreateAdDto_QueryAdDto, config: RunnableConfig) => {
                const { ad_account_id, ...rest } = params;
                const result = await this.metaAdService.create(rest, {
                    ad_account_id
                }, config.configurable?.session);
                return JSON.stringify(result);
            },
            {
                name: 'create_ad',
                description: "Used to create a META ad",
                schema: CreateAdDto_QueryAdDtoSchema 
            }
        );
    }
} 


