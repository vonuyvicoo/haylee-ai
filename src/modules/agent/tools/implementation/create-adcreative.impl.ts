import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../../common";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { Injectable } from "@nestjs/common";
import { CreateAdCreativeDtoSchema, QueryAdCreativeDtoSchema } from "@common/generated/schemas/create-adcreative.dto.schema";
import { Refine } from "@common/types";
import { AdCreativeService } from "@modules/meta/ad-creative/adcreative.service";

export const CreateAdCreativeDto_QueryAdCreativeDtoSchema = z.object({ ...CreateAdCreativeDtoSchema.shape, ...QueryAdCreativeDtoSchema.shape });
export type CreateAdCreativeDto_QueryAdCreativeDto = z.infer<typeof CreateAdCreativeDto_QueryAdCreativeDtoSchema>;

export const CreateAdCreativeRefinement: Refine<CreateAdCreativeDto_QueryAdCreativeDto> = (v, ctx) => {
    if(v.picture && v.image_hash) {
        ctx.addIssue({
            code: "custom",
            path: ['image_hash'],
            message: "picture and image_hash are mutually exclussive - use one or the other"
        });
    }

    if(!v.picture && !v.image_hash && !v.video_id) {
        ctx.addIssue({
            code: "custom",
            path: ["picture", "image_hash", "video_id"],
            message: "One of picture, image_hash, or video_id must be provided."
        })
    }
}

@Injectable()
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
                schema: CreateAdCreativeDto_QueryAdCreativeDtoSchema.superRefine(CreateAdCreativeRefinement)
            }
        );
    }
} 


