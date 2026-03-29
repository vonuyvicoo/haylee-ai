import { Module } from "@nestjs/common";
import { AdAccountService } from "./adaccount.service";
import { AdAccountController } from "./adaccount.controller";
import { MetaCredentialModule } from "../credentials/credential.module";

@Module({
    imports: [MetaCredentialModule],
    controllers: [AdAccountController],
    providers: [AdAccountService],
    exports: [AdAccountService]
})
export class AdAccountModule {}
