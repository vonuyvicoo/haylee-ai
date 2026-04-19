import { IsEnum } from "class-validator";
import { MetaDatePreset } from "src/_shared";

export class FindManyCampaignInsightsDto {
    @IsEnum(MetaDatePreset)
    date_preset: MetaDatePreset; 
}
