import { MetaDatePreset } from "@common/enums";
import { IsEnum } from "class-validator";

export class FindManyAdInsightsDto {
    @IsEnum(MetaDatePreset)
    date_preset: MetaDatePreset; 
}


