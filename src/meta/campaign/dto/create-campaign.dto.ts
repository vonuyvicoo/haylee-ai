import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { Campaign } from "facebook-nodejs-business-sdk";

export enum CampaignObjectiveValue {
    OUTCOME_APP_PROMOTION = "OUTCOME_APP_PROMOTION",
    OUTCOME_AWARENESS = "OUTCOME_AWARENESS",
    OUTCOME_ENGAGEMENT = "OUTCOME_ENGAGEMENT",
    OUTCOME_LEADS = "OUTCOME_LEADS",
    OUTCOME_SALES = "OUTCOME_SALES",
    OUTCOME_TRAFFIC = "OUTCOME_TRAFFIC"
}

export enum CampaignStatus {
    PAUSED = 'PAUSED',
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
    ARCHIVED = 'ARCHIVED'
}


export enum CampaignSpecialAdCategory {
    NONE = "NONE",
    CREDIT = "CREDIT",
    HOUSING = "HOUSING",
    EMPLOYMENT = "EMPLOYMENT",
    ISSUES_ELECTIONS_POLITICS = "ISSUES_ELECTIONS_POLITICS",
    ONLINE_GAMBLING_AND_GAMING = "ONLINE_GAMBLING_AND_GAMING",
    FINANCIAL_PRODUCTS_SERVICES = "FINANCIAL_PRODUCTS_SERVICES"
}

export enum CampaignBidStrategy {
    COST_CAP = "COST_CAP",
    LOWEST_COST_WITHOUT_CAP = "LOWEST_COST_WITHOUT_CAP",
    LOWEST_COST_WITH_BID_CAP = "LOWEST_COST_WITH_BID_CAP",
    LOWEST_COST_WITH_MIN_ROAS = "LOWEST_COST_WITH_MIN_ROAS"
}

export enum CampaignEffectiveStatus {
    PAUSED = "PAUSED",
    ACTIVE = "ACTIVE",
    DELETED = "DELETED",
    ARCHIVED = "ARCHIVED",
    IN_PROCESS = "IN_PROCESS",
    WITH_ISSUES = "WITH_ISSUES"
}

export enum BudgetStrategy {
    CAMPAIGN_BUDGET = "CAMPAIGN_BUDGET",
    ADSET_BUDGET = "ADSET_BUDGET"
}

export class CreateCampaignDto {
    @IsString()
    name: string; 

    @IsEnum(CampaignObjectiveValue)
    objective: CampaignObjectiveValue; 

    @IsEnum(Campaign.Status)
    @IsOptional()
    status: CampaignStatus = CampaignStatus.PAUSED;

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
    @IsEnum(CampaignSpecialAdCategory, { each: true})
    special_ad_categories: CampaignSpecialAdCategory[] = [CampaignSpecialAdCategory.NONE]

}


export class QueryCampaignDto {
    @IsString()
    ad_account_id: string;
}
