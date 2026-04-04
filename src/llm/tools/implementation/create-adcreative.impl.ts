import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { CampaignService } from "src/meta/campaign/campaign.service";
import { FindManyCampaignDto } from "src/meta/campaign/dto/find-many.dto";
import { FindManyCampaignDtoSchema } from "src/generated/schemas/find-many.dto.schema";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ImageGeneratorService } from "src/image-generator/image-generator.service";
import { FilesService } from "src/files/files.service";
import { UserSession } from "@thallesp/nestjs-better-auth";
import { AD_CREATIVE_SKILL } from "src/llm/prompts/adcreative.skill";

export const CreateAdCreativeToolSchema = z.object({
    query: z.string().describe("A rephrased query of the user"),
    width: z.number(),
    height: z.number(),
    title: z.string().describe("What to name the file")
});

export type CreateAdCreativeToolParams = z.infer<typeof CreateAdCreativeToolSchema>;

export class CreateAdCreativeTool extends HayleeTool {
    constructor(
        private imgGen: ImageGeneratorService,
        private fileService: FilesService
    ){
        super();
    }
    getStructuredTool(model: ChatDeepSeek): StructuredTool {
        
        return tool(
            async (params: CreateAdCreativeToolParams, config: RunnableConfig) => {
                const html = await model.invoke(`Create an ad creative based on the user's query: ${params.query}.
Return the FULL HTML file.
Don't do external references.
Your output will be screenshotted on a ${params.width}px width by ${params.height}px height canvas.

Use this skill: ${AD_CREATIVE_SKILL}

Do NOT include animations as this will be screenshotted.
`);

                const session: UserSession = config.configurable?.session;
                const htmlContent = (html.content as string).replace(/^```[\w]*\n?|```$/g, '').trim();
                const buffer = await this.imgGen.generateImage(
                    htmlContent,
                    params.width,
                    params.height
                );

                const file = await this.fileService.create(
                    { title: params.title },
                    {
                        buffer,
                        mimetype: 'image/png',
                        originalname: `${params.title}.png`,
                    } as unknown as Express.Multer.File,
                    session
                );

                return JSON.stringify(file);
            },
            {
                name: 'create_adcreative',
                description: "Used to create adcreatives using HTML",
                schema: CreateAdCreativeToolSchema 
            }
        );
    }
} 


