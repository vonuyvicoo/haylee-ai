import { Module, } from '@nestjs/common';
import { HayleeToolsModule } from './tools/haylee-tools.module';
import { LlmModule } from '@core/llm/llm.module';
import { AgentService } from './agent.service';



@Module({
    imports: [HayleeToolsModule, LlmModule],
    providers: [
        AgentService, 
    ],
    exports: [AgentService]
})
export class AgentModule { }
