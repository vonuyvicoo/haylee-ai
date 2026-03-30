import { IsArray, IsBoolean, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { Campaign } from "facebook-nodejs-business-sdk";

export type CampaignObjectiveValue = typeof Campaign.Objective[keyof typeof Campaign.Objective];
export type CampaignStatus = typeof Campaign.Status[keyof typeof Campaign.Status];
export type CampaignSpecialAdCategory = typeof Campaign.SpecialAdCategories[keyof typeof Campaign.SpecialAdCategories];
export type CampaignBidStrategy = typeof Campaign.BidStrategy[keyof typeof Campaign.BidStrategy];

export enum BudgetStrategy {
    CAMPAIGN_BUDGET = "CAMPAIGN_BUDGET",
    ADSET_BUDGET = "ADSET_BUDGET"
}

export class CreateCampaignDto {
    @IsString()
    name: string; 

    @IsEnum(Campaign.Objective)
    objective: CampaignObjectiveValue; 

    @IsEnum(Campaign.Status)
    @IsOptional()
    status: CampaignStatus = 'PAUSED';

    @IsEnum(BudgetStrategy)
    strategy: BudgetStrategy;

    @ValidateIf(o => o.strategy === BudgetStrategy.ADSET_BUDGET)
    @IsBoolean()
    @IsNotEmpty()
    is_adset_budget_sharing_enabled: boolean;

    @ValidateIf(o => o.strategy === BudgetStrategy.CAMPAIGN_BUDGET && !o.lifetime_budget) 
    @IsNotEmpty()
    @IsNumber()
    daily_budget: number;

    @ValidateIf(o => o.strategy === BudgetStrategy.CAMPAIGN_BUDGET && !o.daily_budget)
    @IsNotEmpty()
    @IsNumber()
    lifetime_budget: number;

    @IsNotEmpty()
    @IsEnum(Campaign.BidStrategy)
    bid_strategy: CampaignBidStrategy;

    @IsOptional()
    @IsArray()
    @IsEnum(Campaign.SpecialAdCategories, { each: true})
    special_ad_categories: CampaignSpecialAdCategory[] = [Campaign.SpecialAdCategories.none];
    

}



export class QueryCampaignDto {
    @IsString()
    ad_account_id: string;
}
