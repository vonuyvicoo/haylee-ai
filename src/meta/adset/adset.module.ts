import { Module } from "@nestjs/common";
import { AdSetService } from "./adset.service";
import { AdSetController } from "./adset.controller";
import { MetaCredentialModule } from "../credentials/credential.module";

@Module({
    imports: [MetaCredentialModule],
    controllers: [AdSetController],
    providers: [AdSetService],
    exports: [AdSetService]
})
export class AdSetModule {}
