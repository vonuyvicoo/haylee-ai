import { Module } from "@nestjs/common";
import { IntegrationService } from "./integration.service";
import { IntegrationController } from "./integration.controller";
import { PrismaModule } from "@core/prisma/prisma.module";
import { EncryptionModule } from "@common/utils/encryption/encryption.module";

@Module({
    imports: [PrismaModule, EncryptionModule],
    controllers: [IntegrationController],
    providers: [IntegrationService],
    exports: [IntegrationService]
})
export class IntegrationModule {}
