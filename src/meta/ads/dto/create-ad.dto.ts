import { IsEnum, IsOptional, IsString } from "class-validator";

export enum AdStatus {
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    DELETED = "DELETED",
    ARCHIVED = "ARCHIVED"
}

export class CreateAdDto {
    @IsString()
    name: string;

    @IsString()
    adset_id: string;

    @IsString()
    creative_id: string;

    @IsEnum(AdStatus)
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

    @IsEnum(AdStatus)
    @IsOptional()
    status?: AdStatus;
}
