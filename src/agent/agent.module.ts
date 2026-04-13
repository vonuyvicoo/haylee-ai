import { Module, } from '@nestjs/common';
import { AgentService } from './agent.service';
import { HayleeToolsModule } from './tools/haylee-tools.module';
import { LlmModule } from 'src/llm/llm.module';



@Module({
    imports: [HayleeToolsModule, LlmModule],
    providers: [
        AgentService, 
    ],
    exports: [AgentService]
})
export class AgentModule { }
