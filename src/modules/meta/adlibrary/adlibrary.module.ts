import { Module } from "@nestjs/common";
import { MetaCredentialModule } from "../credentials/credential.module";
import { AdLibraryController } from "./adlibrary.controller";
import { AdLibraryService } from "./adlibrary.service";

@Module({
    imports: [MetaCredentialModule],
    controllers: [AdLibraryController],
    providers: [AdLibraryService],
    exports: [AdLibraryService]
})
export class AdLibraryModule {}
