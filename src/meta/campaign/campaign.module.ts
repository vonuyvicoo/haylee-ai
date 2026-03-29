import { Module } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { MetaCredentialModule } from "../credentials/credential.module";
import { CampaignController } from "./campaign.controller";

@Module({
    imports: [MetaCredentialModule],
    controllers: [CampaignController],
    providers: [CampaignService],
    exports: [CampaignService]
})
export class CampaignModule {}
