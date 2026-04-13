import { Module, Provider } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LLMFactory } from './factory/llm.factory';
import { CampaignModule } from 'src/meta/campaign/campaign.module';
import { ImageGeneratorModule } from 'src/image-generator/image-generator.module';
import { FilesModule } from 'src/files/files.module';
import { 
    FindManyCampaignsTool, 
    CreateImageTool, 
    CreateCampaignTool, 
    CreateAdSetTool, 
    CreateAdTool, 
    CreateAdCreativeTool,
    SearchInterestsTool,
    UploadMediaLibraryToMetaTool
} from './tools/implementation';
import { AdSetModule } from 'src/meta/adset/adset.module';
import { AdModule } from 'src/meta/ads/ads.module';
import { AdCreativeModule } from 'src/meta/ad-creative/adcreative.module';
import { HAYLEE_TOOL_TOKEN, MAIN_LLM_TOKEN } from 'src/_shared/constants';
import { HayleeTool } from './tools/base';

export const LLMProvider: Provider = {
    provide: MAIN_LLM_TOKEN,
    useFactory: (factory: LLMFactory) => {
        return factory.createMainLLM() 
    },
    inject: [LLMFactory]
}

const ToolClasses = [
    CreateAdTool,
    CreateAdCreativeTool,
    CreateAdSetTool,
    CreateCampaignTool,
    CreateImageTool,
    FindManyCampaignsTool,
    SearchInterestsTool,
    UploadMediaLibraryToMetaTool

]

const HayleeToolProvider: Provider = {
    provide: HAYLEE_TOOL_TOKEN,
    useFactory: (...tools: HayleeTool[]) => tools,
    inject: ToolClasses
}

// img gen module at app root 

@Module({
    imports: [CampaignModule, AdSetModule, AdModule, AdCreativeModule, FilesModule, ImageGeneratorModule],
    providers: [
        LlmService, 
        LLMFactory, 
        HayleeToolProvider, 
        LLMProvider, 
        ...ToolClasses
    ],
    exports: [LlmService]
})
export class LlmModule { }
