import { IsEnum, IsOptional, IsString } from "class-validator";
import { Ad } from "facebook-nodejs-business-sdk";

export type AdStatus = typeof Ad.Status[keyof typeof Ad.Status];

export class CreateAdDto {
    @IsString()
    name: string;

    @IsString()
    adset_id: string;

    @IsString()
    creative_id: string;

    @IsEnum(Ad.Status)
    @IsOptional()
    status?: AdStatus;
}

export class QueryAdDto {
    @IsString()
    ad_account_id: string;
}

export class UpdateAdDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(Ad.Status)
    @IsOptional()
    status?: AdStatus;
}
