import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { QueryAdCreativeDtoSchema } from "src/generated/schemas/create-adcreative.dto.schema";
import { AdCreativeService } from "src/meta/ad-creative/adcreative.service";
import { MigrateAdCreativeDtoSchema } from "src/generated/schemas/migrate-adcreative.dto.schema";

export const MigrateAdCreativeDto_QueryAdCreativeDtoSchema = z.object({ ...MigrateAdCreativeDtoSchema.shape, ...QueryAdCreativeDtoSchema.shape });
export type MigrateAdCreativeDto_QueryAdCreativeDto = z.infer<typeof MigrateAdCreativeDto_QueryAdCreativeDtoSchema>;

export class UploadMediaLibraryToMetaTool extends HayleeTool {
    constructor(private metaAdCreativeService: AdCreativeService){
        super();
    }
    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: MigrateAdCreativeDto_QueryAdCreativeDto, config: RunnableConfig) => {
                const { ad_account_id, after, ...rest } = params;
                const result = await this.metaAdCreativeService.uploadFromMediaLibrary(
                    ad_account_id, 
                    rest, 
                    config.configurable?.session
                );
                return JSON.stringify(result);
            },
            {
                name: 'upload_media_library_to_meta',
                description: "Used to upload a media library image to meta",
                schema: MigrateAdCreativeDto_QueryAdCreativeDtoSchema
            }
        );
    }
} 


