import { Module } from "@nestjs/common";
import { EmailFactory } from "./email.factory";
import { PrismaModule } from "@core/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [EmailFactory],
    exports: [EmailFactory],
})
export class EmailModule {}
