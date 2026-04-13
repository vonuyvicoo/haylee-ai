import { StructuredTool, tool } from "langchain";
import { HayleeTool } from "../base";
import z from "zod";
import { Inject, Injectable } from "@nestjs/common";
import { IRunnableSubagent, SubagentMap } from "src/agent/subagents/interface";
import { HAYLEE_SUBAGENT_TOKEN } from "src/_shared/constants";
import { ResearchSubAgentParams } from "src/agent/subagents/researcher.subagent";

export const LaunchResearchSubagentSchema = z.object({
    task: z.string(),
});

export type LaunchResearchSubagentParams = z.infer<typeof LaunchResearchSubagentSchema>;

@Injectable()
export class LaunchResearcherSubagentTool extends HayleeTool {
    constructor(@Inject(HAYLEE_SUBAGENT_TOKEN) private readonly subagents: SubagentMap){
        super();
    }
    getStructuredTool(): StructuredTool {

        return tool(
            async (params: LaunchResearchSubagentParams) => {
                const subagent: IRunnableSubagent<ResearchSubAgentParams> = this.subagents.SEARCH;
                await subagent.run({
                    params: {
                        task: params.task
                    }
                });
            },
            {
                name: 'launch_research_subagent',
                description: "Use this tool to search about a certain topic. To find niche details, and deep research",
                schema: LaunchResearchSubagentSchema 
            }
        );
    }
} 
