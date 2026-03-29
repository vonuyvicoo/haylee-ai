import { Module } from "@nestjs/common";
import { EncryptionModule } from "src/encryption/encryption.module";
import { IntegrationModule } from "src/integrations/integration.module";
import { MetaCredentialService } from "./credential.service";
import { MetaRequestContext } from "../interceptors/meta.context";

@Module({
    imports: [IntegrationModule, EncryptionModule],
    providers: [MetaCredentialService, MetaRequestContext],
    exports: [MetaCredentialService]
})
export class MetaCredentialModule {}
