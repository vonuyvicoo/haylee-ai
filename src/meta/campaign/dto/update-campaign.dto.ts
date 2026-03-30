import { CreateCampaignDto } from "./create-campaign.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}

