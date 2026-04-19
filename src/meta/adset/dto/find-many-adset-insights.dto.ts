import { IsEnum } from "class-validator";
import { MetaDatePreset } from "src/_shared";

export class FindManyAdSetsInsightsDto {
    @IsEnum(MetaDatePreset)
    date_preset: MetaDatePreset; 
}

