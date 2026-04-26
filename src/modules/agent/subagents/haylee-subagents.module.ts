import { Module, Provider } from "@nestjs/common";
import { ResearchSubAgent, } from "./researcher.subagent";
import { IRunnableSubagent, SubagentMap } from "./interface";
import { HAYLEE_SUBAGENT_TOKEN } from "@common/constants";
import { LlmModule } from "@core/llm/llm.module";
import { HayleeSubagentToolsModule } from "./tools/subagent-tools.module";

const AgentClasses = [
    ResearchSubAgent
]

export const HayleeSubAgentFactory = function(...args: IRunnableSubagent<unknown>[]): SubagentMap {
    return args.reduce((map, agent) => {
        map[agent.name] = agent;
        return map;
    }, {} as SubagentMap)
}

export const HayleeSubagentProvider: Provider = {
    provide: HAYLEE_SUBAGENT_TOKEN,
    useFactory: HayleeSubAgentFactory,
    inject: AgentClasses
}

@Module({
    imports: [LlmModule, HayleeSubagentToolsModule],
    providers: [
        ...AgentClasses,
        HayleeSubagentProvider
    ],
    exports: [HAYLEE_SUBAGENT_TOKEN]
})
export class HayleeSubagentsModule {
}
