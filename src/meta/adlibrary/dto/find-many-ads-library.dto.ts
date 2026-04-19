import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { CountryCode } from "src/_shared";

export enum AdLibraryAdStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ALL = "ALL"
}

export class FindManyAdsLibraryDto {
    @IsEnum(AdLibraryAdStatus)
    @IsOptional()
    ad_active_status: AdLibraryAdStatus = AdLibraryAdStatus.ALL;

    @IsArray()
    @IsEnum(CountryCode, { each: true })
    @IsOptional()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    ad_reached_countries: CountryCode[] = [CountryCode.ALL];
}
