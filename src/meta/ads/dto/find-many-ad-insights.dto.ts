import { IsEnum } from "class-validator";
import { MetaDatePreset } from "src/_shared";

export class FindManyAdInsightsDto {
    @IsEnum(MetaDatePreset)
    date_preset: MetaDatePreset; 
}


