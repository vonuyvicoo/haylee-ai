import { createAgent, HumanMessage, ReactAgent } from "langchain";
import { IRunnableSubagent, RunnableInvocationParams } from "./runnable-subagent";
import z from "zod";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export const ResearchSubAgentSchema = z.object({
    task: z.string().describe("Detailed task instructions for the subagent.")
});

export type ResearchSubAgentParams = z.infer<typeof ResearchSubAgentSchema>;

export class ResearchSubAgent implements IRunnableSubagent<ResearchSubAgentParams> {
    private agent: ReactAgent;

    constructor(model: BaseChatModel){
        this.agent = createAgent({
            model,
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
