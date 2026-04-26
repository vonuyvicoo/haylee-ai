import { Module, Provider } from "@nestjs/common"
import { SearchModule } from "@common/utils/search/search.module"
import { SearchWebTool } from "./implementation"
import { HAYLEE_SUBAGENT_TOOL_TOKEN } from "@common/constants"
import { HayleeTool } from "@modules/agent/common"
import { FetchURLTool } from "./implementation/fetch-url.impl"

const ToolClasses = [
    SearchWebTool,
    FetchURLTool
]

const HayleeToolProvider: Provider = {
    provide: HAYLEE_SUBAGENT_TOOL_TOKEN,
    useFactory: (...tools: HayleeTool[]) => tools,
    inject: ToolClasses
}

@Module({
    imports: [
        SearchModule 
    ],
    providers: [...ToolClasses, HayleeToolProvider],
    exports: [HAYLEE_SUBAGENT_TOOL_TOKEN]
})
export class HayleeSubagentToolsModule {}

