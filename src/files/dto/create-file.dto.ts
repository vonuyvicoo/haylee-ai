import { IsOptional, IsString } from "class-validator";

export class CreateFileDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    type?: string;
}
