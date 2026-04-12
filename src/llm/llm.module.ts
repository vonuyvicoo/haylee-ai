import { Module, Provider } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LLMFactory } from './factory/llm.factory';
import { HayleeToolFactory } from './tools/factory';
import { CampaignService } from 'src/meta/campaign/campaign.service';
import { FindManyCampaignsTool } from './tools/implementation';
import { CampaignModule } from 'src/meta/campaign/campaign.module';
import { ImageGeneratorService } from 'src/image-generator/image-generator.service';
import { ImageGeneratorModule } from 'src/image-generator/image-generator.module';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';
import { CreateImageTool } from './tools/implementation/create-image.impl';
import { CreateCampaignTool } from './tools/implementation/create-campaign.impl';
import { CreateAdSetTool } from './tools/implementation/create-adset.impl';
import { CreateAdTool } from './tools/implementation/create-ad.impl';
import { CreateAdCreativeTool } from './tools/implementation/create-adcreative.impl';
import { AdSetService } from 'src/meta/adset/adset.service';
import { AdCreativeService } from 'src/meta/ad-creative/adcreative.service';
import { AdService } from 'src/meta/ads/ads.service';
import { AdSetModule } from 'src/meta/adset/adset.module';
import { AdModule } from 'src/meta/ads/ads.module';
import { AdCreativeModule } from 'src/meta/ad-creative/adcreative.module';
import { SearchInterestsTool } from './tools/implementation/search-interests.impl';
import { UploadMediaLibraryToMetaTool } from './tools/implementation/upload_medialibrary_to_meta.impl';

const HayleeToolProvider: Provider = {
    provide: HayleeToolFactory,
    useFactory: (
        metaCampaignService: CampaignService,
        imgGenService: ImageGeneratorService,
        fileService: FilesService,
        adSetService: AdSetService,
        adCreativeService: AdCreativeService,
        adService: AdService
    ) => {
        const factory = new HayleeToolFactory();
        factory.register("find_many_campaigns", new FindManyCampaignsTool(metaCampaignService));
        factory.register("create_image", new CreateImageTool(imgGenService, fileService));
        factory.register("create_campaign", new CreateCampaignTool(metaCampaignService));
        factory.register("create_adset", new CreateAdSetTool(adSetService));
        factory.register("create_ad", new CreateAdTool(adService));
        factory.register("create_adcreative", new CreateAdCreativeTool(adCreativeService));
        factory.register("search_interests", new SearchInterestsTool(adSetService));
        factory.register("upload_media_library_to_meta", new UploadMediaLibraryToMetaTool(adCreativeService));
        return factory;
    },
    inject: [CampaignService, ImageGeneratorService, FilesService, AdSetService, AdCreativeService, AdService]
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
    imports: [CampaignModule, AdSetModule, AdModule, AdCreativeModule, FilesModule, ImageGeneratorModule],
    providers: [
        LlmService, 
        LLMFactory, 
        HayleeToolProvider, 
        LLMProvider, 
    ],
    exports: [LlmService]
})
export class LlmModule { }
