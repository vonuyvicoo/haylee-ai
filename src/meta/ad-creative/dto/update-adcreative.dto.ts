import { IsEnum, IsOptional, IsString } from "class-validator";
import { AdCreative } from "facebook-nodejs-business-sdk";

export type AdCreativeStatus = typeof AdCreative.Status[keyof typeof AdCreative.Status];

export class UpdateAdCreativeDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(AdCreative.Status)
    @IsOptional()
    status?: AdCreativeStatus;
}
