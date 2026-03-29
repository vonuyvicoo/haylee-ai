import { IsOptional, IsString } from "class-validator";

export class FindManyCampaignDto {
    @IsString()
    ad_account_id: string;
    
    @IsString()
    @IsOptional()
    after?: string;
}
