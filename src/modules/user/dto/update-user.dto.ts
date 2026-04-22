import { IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "../types";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name: string;
    @IsEnum(Role)
    @IsOptional()
    role: Role;
}
