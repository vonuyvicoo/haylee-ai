import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { ImageGeneratorService } from "src/image-generator/image-generator.service";
import { FilesService } from "src/files/files.service";
import { UserSession } from "@thallesp/nestjs-better-auth";
import { AD_CREATIVE_SKILL } from "src/llm/prompts/adcreative.skill";
import { Inject, Injectable } from "@nestjs/common";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export const CreateImageToolSchema = z.object({
    query: z.string().describe("A rephrased query of the user"),
    width: z.number(),
    height: z.number(),
    title: z.string().describe("What to name the file")
});

export type CreateImageToolParams = z.infer<typeof CreateImageToolSchema>;


@Injectable()
export class CreateImageTool extends HayleeTool {
    constructor(
        private imgGen: ImageGeneratorService,
        private fileService: FilesService,
        @Inject("MAIN_LLM") private readonly model: BaseChatModel
    ){
        super();
    }
    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: CreateImageToolParams, config: RunnableConfig) => {
                const html = await this.model.invoke(`Create an ad creative based on the user's query: ${params.query}.
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
                name: 'create_image',
                description: "Used to create adcreatives using HTML. This uploads the file to our media library only. Not Meta yet.",
                schema: CreateImageToolSchema 
            }
        );
    }
} 


