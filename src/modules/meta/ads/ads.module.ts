import { Module } from "@nestjs/common";
import { AdController } from "./ads.controller";
import { AdService } from "./ads.service";
import { MetaCredentialModule } from "../credentials/credential.module";

@Module({
    imports: [MetaCredentialModule],
    controllers: [AdController],
    providers: [AdService],
    exports: [AdService]
})
export class AdModule {}
