import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { PrismaModule } from "@core/prisma/prisma.module";
import { UserModule } from "@modules/user/user.module";

@Module({
    controllers: [SubscriptionController],
    imports: [PrismaModule, UserModule, ],
    providers: [SubscriptionService],
    exports: [SubscriptionService]
})
export class SubscriptionModule {}

