import { Module } from "@nestjs/common";
import { AdCreativeService } from "./adcreative.service";
import { AdCreativeController } from "./adcreative.controller";
import { MetaCredentialModule } from "../credentials/credential.module";

@Module({
    imports: [MetaCredentialModule],
    controllers: [AdCreativeController],
    providers: [AdCreativeService],
    exports: [AdCreativeService]
})
export class AdCreativeModule {}
