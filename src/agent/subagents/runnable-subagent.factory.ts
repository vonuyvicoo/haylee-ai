import { BaseChatModel } from "@langchain/core/language_models/chat_models"
import { ResearchSubAgent } from "./researcher.subagent"
import { IRunnableSubagent } from "./runnable-subagent"

export enum RunnableSubAgentType {
    SEARCH = "search"
}

export class RunnableSubAgentFactory {
    static create(type: RunnableSubAgentType, model: BaseChatModel){

        const RunnableType_AgentMap: Record<RunnableSubAgentType, IRunnableSubagent<unknown>> = {
            [RunnableSubAgentType.SEARCH]: new ResearchSubAgent(model)
        };

        return RunnableType_AgentMap[type];
    }
}
