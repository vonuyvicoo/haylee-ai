import { Module } from "@nestjs/common";
import { EncryptionModule } from "src/encryption/encryption.module";
import { IntegrationModule } from "src/integrations/integration.module";
import { MetaCredentialService } from "./credential.service";

@Module({
    imports: [IntegrationModule, EncryptionModule],
    providers: [MetaCredentialService],
    exports: [MetaCredentialService]
})
export class MetaCredentialModule {}
