import { IsEnum, IsOptional, IsString } from "class-validator";

export enum TargetType {
    AD_INTEREST = "adinterest",
    AD_TARGETING_CATEGORY = "adTargetingCategory",
    /// more at https://developers.facebook.com/docs/marketing-api/audiences/reference/targeting-search#interests
}

export enum TargetClass {
    INTERESTS = "interests",
    BEHAVIORS = "behaviors",
}

export class FindManyTargetingOptionsDto {
    @IsEnum(TargetType)
    type: TargetType;
    
    @IsEnum(TargetClass)
    class: TargetClass;
    
    @IsString()
    @IsOptional()
    query?: string;
}
