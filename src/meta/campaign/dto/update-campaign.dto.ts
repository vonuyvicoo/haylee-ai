import { CreateCampaignDto } from "./create-campaign.dto";
import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
    @IsBoolean()
    @IsOptional()
    is_adset_budget_sharing_enabled?: boolean;
}

