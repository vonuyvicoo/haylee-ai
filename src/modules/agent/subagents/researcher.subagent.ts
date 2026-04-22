import { createAgent, HumanMessage, ReactAgent } from "langchain";
import { IRunnableSubagent, RunnableInvocationParams, RunnableSubagentType } from "./interface";
import z from "zod";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { Inject, Injectable } from "@nestjs/common";
import { MAIN_LLM_TOKEN } from "@common/constants";

export const ResearchSubAgentSchema = z.object({
    task: z.string().describe("Detailed task instructions for the subagent.")
});

export type ResearchSubAgentParams = z.infer<typeof ResearchSubAgentSchema>;

@Injectable()
export class ResearchSubAgent implements IRunnableSubagent<ResearchSubAgentParams> {
    private agent: ReactAgent;
    public name = RunnableSubagentType.SEARCH;

    constructor(
        @Inject(MAIN_LLM_TOKEN) private readonly model: BaseChatModel
    ){
        this.agent = createAgent({
            model: this.model,
            systemPrompt: "You are a researcher subagent",
        })
    }

    async run(options: RunnableInvocationParams<ResearchSubAgentParams>): Promise<void> {
        await this.agent.invoke({
            messages: [new HumanMessage(options.params.task)]
        });

        return;
        //langchain handles the stream and output
    } 
}
