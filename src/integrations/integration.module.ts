import { Module } from "@nestjs/common";
import { IntegrationService } from "./integration.service";
import { IntegrationController } from "./integration.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { EncryptionModule } from "src/_shared/utils/encryption/encryption.module";

@Module({
    imports: [PrismaModule, EncryptionModule],
    controllers: [IntegrationController],
    providers: [IntegrationService],
    exports: [IntegrationService]
})
export class IntegrationModule {}
