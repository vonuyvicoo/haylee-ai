import { Module } from "@nestjs/common";
import { AdCreativeService } from "./adcreative.service";
import { AdCreativeController } from "./adcreative.controller";
import { FilesModule } from "@modules/files/files.module";
import { MetaCredentialModule } from "../credentials/credential.module";

@Module({
    imports: [MetaCredentialModule, FilesModule],
    controllers: [AdCreativeController],
    providers: [AdCreativeService],
    exports: [AdCreativeService]
})
export class AdCreativeModule {}
