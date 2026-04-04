import { Module, Provider } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LLMFactory } from './factory/llm.factory';
import { HayleeToolFactory } from './tools/factory';
import { CampaignService } from 'src/meta/campaign/campaign.service';
import { FindManyCampaignsTool } from './tools/implementation';
import { CampaignModule } from 'src/meta/campaign/campaign.module';

const HayleeToolProvider: Provider = {
    provide: HayleeToolFactory,
    useFactory: (
        metaCampaignService: CampaignService 
    ) => {
        const factory = new HayleeToolFactory();
        factory.register("find_many_campaigns", new FindManyCampaignsTool(metaCampaignService));
        return factory;
    },
    inject: [CampaignService]
}

export const LLMProvider: Provider = {
    provide: 'MAIN_LLM',
    useFactory: (factory: LLMFactory) => {
        return factory.createMainLLM() 
    },
    inject: [LLMFactory]
}

@Module({
    imports: [CampaignModule],
    providers: [
        LlmService, 
        LLMFactory, 
        HayleeToolProvider, 
        LLMProvider, 
    ],
    exports: [LlmService]
})
export class LlmModule { }
