import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { SupabaseModule } from "@core/supabase/supabase.module";
import { PrismaModule } from "@core/prisma/prisma.module";

@Module({
    imports: [SupabaseModule, PrismaModule],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService]
})
export class FilesModule {}
