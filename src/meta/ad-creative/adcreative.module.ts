import { Module } from "@nestjs/common";
import { AdCreativeService } from "./adcreative.service";
import { AdCreativeController } from "./adcreative.controller";
import { MetaCredentialModule } from "../credentials/credential.module";
import { FilesModule } from "src/files/files.module";

@Module({
    imports: [MetaCredentialModule, FilesModule],
    controllers: [AdCreativeController],
    providers: [AdCreativeService],
    exports: [AdCreativeService]
})
export class AdCreativeModule {}
