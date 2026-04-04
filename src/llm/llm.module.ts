import { Module, Provider } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LLMFactory } from './factory/llm.factory';
import { HayleeToolFactory } from './tools/factory';
import { CampaignService } from 'src/meta/campaign/campaign.service';
import { FindManyCampaignsTool } from './tools/implementation';
import { CampaignModule } from 'src/meta/campaign/campaign.module';
import { CreateAdCreativeTool } from './tools/implementation/create-adcreative.impl';
import { ImageGeneratorService } from 'src/image-generator/image-generator.service';
import { ImageGeneratorModule } from 'src/image-generator/image-generator.module';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';

const HayleeToolProvider: Provider = {
    provide: HayleeToolFactory,
    useFactory: (
        metaCampaignService: CampaignService,
        imgGenService: ImageGeneratorService,
        fileService: FilesService
    ) => {
        const factory = new HayleeToolFactory();
        factory.register("find_many_campaigns", new FindManyCampaignsTool(metaCampaignService));
        factory.register("create_adcreative", new CreateAdCreativeTool(imgGenService, fileService))
        return factory;
    },
    inject: [CampaignService, ImageGeneratorService, FilesService]
}

export const LLMProvider: Provider = {
    provide: 'MAIN_LLM',
    useFactory: (factory: LLMFactory) => {
        return factory.createMainLLM() 
    },
    inject: [LLMFactory]
}

// img gen module at app root 

@Module({
    imports: [CampaignModule, FilesModule, ImageGeneratorModule],
    providers: [
        LlmService, 
        LLMFactory, 
        HayleeToolProvider, 
        LLMProvider, 
    ],
    exports: [LlmService]
})
export class LlmModule { }
