import { MetaDatePreset } from "@common/enums";
import { IsEnum } from "class-validator";

export class FindManyAdSetsInsightsDto {
    @IsEnum(MetaDatePreset)
    date_preset: MetaDatePreset; 
}

