import { Module, Provider } from "@nestjs/common"
import { CreateAdCreativeTool, CreateAdSetTool, CreateAdTool, CreateCampaignTool, CreateImageTool, FindManyCampaignsTool, GetAdInsightsTool, GetAdSetInsightsTool, GetCampaignInsightsTool, LaunchResearcherSubagentTool, SearchInterestsTool, SendEmailTool, UploadMediaLibraryToMetaTool } from "./implementation"
import { HAYLEE_TOOL_TOKEN } from "@common/constants"
import { HayleeTool } from "../common"
import { CampaignModule } from "@modules/meta/campaign/campaign.module"
import { AdSetModule } from "@modules/meta/adset/adset.module"
import { AdModule } from "@modules/meta/ads/ads.module"
import { AdCreativeModule } from "@modules/meta/ad-creative/adcreative.module"
import { FilesModule } from "@modules/files/files.module"
import { ImageGeneratorModule } from "@core/image-generator/image-generator.module"
import { LlmModule } from "@core/llm/llm.module"
import { HayleeSubagentsModule } from "../subagents/haylee-subagents.module"
import { EmailModule } from "@modules/email/email.module"

const ToolClasses = [
    CreateAdTool,
    CreateAdCreativeTool,
    CreateAdSetTool,
    CreateCampaignTool,
    CreateImageTool,
    FindManyCampaignsTool,
    SearchInterestsTool,
    UploadMediaLibraryToMetaTool,
    LaunchResearcherSubagentTool,
    GetAdInsightsTool,
    GetAdSetInsightsTool,
    GetCampaignInsightsTool,
    SendEmailTool
]

const HayleeToolProvider: Provider = {
    provide: HAYLEE_TOOL_TOKEN,
    useFactory: (...tools: HayleeTool[]) => tools,
    inject: ToolClasses
}

@Module({
    imports: [
        CampaignModule, AdSetModule, AdModule, 
        AdCreativeModule, FilesModule, ImageGeneratorModule, 
        LlmModule, HayleeSubagentsModule,
        EmailModule
    ],
    providers: [...ToolClasses, HayleeToolProvider],
    exports: [HAYLEE_TOOL_TOKEN]
})
export class HayleeToolsModule {}
