import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { AdService } from "src/meta/ads/ads.service";
import { RunnableSubAgentFactory, RunnableSubAgentType } from "src/agent/subagents/runnable-subagent.factory";
import { Inject, Injectable } from "@nestjs/common";
import { MAIN_LLM_TOKEN } from "src/_shared/constants";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export const LaunchSubagentSchema = z.object({
    task: z.string(),
    type: z.enum(RunnableSubAgentType)
});

export type LaunchSubagentParams = z.infer<typeof LaunchSubagentSchema>;
/*
@Injectable()
export class LaunchSubagentTool extends HayleeTool {
    constructor(@Inject(MAIN_LLM_TOKEN) private readonly model: BaseChatModel){
        super();
    }
    getStructuredTool(): StructuredTool {

        return tool(
            async (params: LaunchSubagentParams, config: RunnableConfig) => {
                const subagent = RunnableSubAgentFactory.create(
                    params.type,

                ) 
            },
            {
                name: 'create_ad',
                description: "Used to create a META ad",
                schema: CreateAdDto_QueryAdDtoSchema 
            }
        );
    }
} */
