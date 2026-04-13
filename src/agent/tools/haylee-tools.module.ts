import { Module, Provider } from "@nestjs/common"
import { CreateAdCreativeTool, CreateAdSetTool, CreateAdTool, CreateCampaignTool, CreateImageTool, FindManyCampaignsTool, LaunchResearcherSubagentTool, SearchInterestsTool, UploadMediaLibraryToMetaTool } from "./implementation"
import { HAYLEE_TOOL_TOKEN } from "src/_shared/constants"
import { HayleeTool } from "./base"
import { CampaignModule } from "src/meta/campaign/campaign.module"
import { AdSetModule } from "src/meta/adset/adset.module"
import { AdModule } from "src/meta/ads/ads.module"
import { AdCreativeModule } from "src/meta/ad-creative/adcreative.module"
import { FilesModule } from "src/files/files.module"
import { ImageGeneratorModule } from "src/image-generator/image-generator.module"
import { LlmModule } from "src/llm/llm.module"
import { HayleeSubagentsModule } from "../subagents/haylee-subagents.module"

const ToolClasses = [
    CreateAdTool,
    CreateAdCreativeTool,
    CreateAdSetTool,
    CreateCampaignTool,
    CreateImageTool,
    FindManyCampaignsTool,
    SearchInterestsTool,
    UploadMediaLibraryToMetaTool,
    LaunchResearcherSubagentTool
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
        LlmModule, HayleeSubagentsModule
    ],
    providers: [...ToolClasses, HayleeToolProvider],
    exports: [HAYLEE_TOOL_TOKEN]
})
export class HayleeToolsModule {}
