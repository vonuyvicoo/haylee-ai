import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { SubscriptionController } from "./subscription.controller";

@Module({
    controllers: [SubscriptionController],
    imports: [PrismaModule, UserModule, ],
    providers: [SubscriptionService],
    exports: [SubscriptionService]
})
export class SubscriptionModule {}

