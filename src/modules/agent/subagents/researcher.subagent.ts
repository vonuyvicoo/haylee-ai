import { createAgent, HumanMessage, ReactAgent } from "langchain";
import { IRunnableSubagent, RunnableInvocationParams, RunnableSubagentType } from "./interface";
import z from "zod";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { Inject, Injectable } from "@nestjs/common";
import { HAYLEE_SUBAGENT_TOOL_TOKEN, MAIN_LLM_TOKEN } from "@common/constants";
import { HayleeTool } from "../common";
import { handleToolErrors } from "../middleware/tool-error.middleware";

export const ResearchSubAgentSchema = z.object({
    task: z.string().describe("Detailed task instructions for the subagent.")
});

export type ResearchSubAgentParams = z.infer<typeof ResearchSubAgentSchema>;

@Injectable()
export class ResearchSubAgent implements IRunnableSubagent<ResearchSubAgentParams> {
    private agent: ReactAgent;
    public name = RunnableSubagentType.SEARCH;

    constructor(
        @Inject(MAIN_LLM_TOKEN) private readonly model: BaseChatModel,
        @Inject(HAYLEE_SUBAGENT_TOOL_TOKEN) private readonly tools: HayleeTool[],
    ){}

    async onModuleInit() {
        const agentTools = Object.keys(this.tools).map((key) => {
            return this.tools[key].getStructuredTool();
        });

        this.agent = createAgent({
            model: this.model,
            tools: [...agentTools],
            systemPrompt: "You are a researcher subagent",
            middleware: [
                handleToolErrors
            ],
        });

    }

    async run(options: RunnableInvocationParams<ResearchSubAgentParams>): Promise<string> {
        const result = await this.agent.invoke({
            messages: [new HumanMessage(options.params.task)],
            ...options.config,
        });

        const messages: any[] = result.messages ?? [];
        const last = [...messages].reverse().find(m => m._getType?.() === 'ai' || m.constructor?.name === 'AIMessage');
        return last?.content ?? 'Research complete. No summary available.';
    }
}
