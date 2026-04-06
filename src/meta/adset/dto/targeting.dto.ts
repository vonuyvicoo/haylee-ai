import {
  IsArray,
  IsIn,
  IsInt,
    IsISO31661Alpha2,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class TargetingRegionDto {
    @IsString()
    key: string;
}

export class TargetingCityDto {
    @IsString()
    key: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    radius?: number;

    @IsOptional()
    @IsIn(["mile", "kilometer"])
    distance_unit?: "mile" | "kilometer";
}

export class TargetingAutomationDto {
    @IsNumber()
    @Min(0)
    @Max(1)
    advantage_audience: number;
}

export class TargetingGeoLocationsDto {
    @IsOptional()
    @IsArray()
    @IsISO31661Alpha2({ each: true })
    countries?: string[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TargetingRegionDto)
    regions?: TargetingRegionDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TargetingCityDto)
    cities?: TargetingCityDto[];
}

export class TargetingInterestDto {
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    name?: string;
}

export class TargetingBehaviorDto {
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    name?: string;
}

export class TargetingFlexibleSpecItemDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TargetingInterestDto)
    interests?: TargetingInterestDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TargetingBehaviorDto)
    behaviors?: TargetingBehaviorDto[];
}

export class MetaTargetingDto {
    @IsObject()
    @ValidateNested()
    @Type(() => TargetingGeoLocationsDto)
    geo_locations: TargetingGeoLocationsDto;

    @IsOptional()
    @IsInt()
    @Min(13)
    @Max(65)
    age_min?: number;

    @IsOptional()
    @IsInt()
    @Min(13)
    @Max(65)
    age_max?: number;
    
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => TargetingAutomationDto)
    targeting_automation?: TargetingAutomationDto;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    genders?: number[]; // 1=male, 2=female

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TargetingFlexibleSpecItemDto)
    flexible_spec?: TargetingFlexibleSpecItemDto[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    publisher_platforms?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    facebook_positions?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    instagram_positions?: string[];
}
