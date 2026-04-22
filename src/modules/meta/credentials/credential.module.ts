import { Module } from "@nestjs/common";
import { MetaCredentialService } from "./credential.service";
import { IntegrationModule } from "@modules/integrations/integration.module";
import { EncryptionModule } from "@common/utils/encryption/encryption.module";

@Module({
    imports: [IntegrationModule, EncryptionModule],
    providers: [MetaCredentialService],
    exports: [MetaCredentialService]
})
export class MetaCredentialModule {}
