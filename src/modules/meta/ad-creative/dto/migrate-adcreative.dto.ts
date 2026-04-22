import { IsString, IsUUID } from "class-validator";

export class MigrateAdCreativeDto {
    @IsString()
    @IsUUID()
    file_id: string;
}
