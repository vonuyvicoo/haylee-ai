import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { AdSet } from "facebook-nodejs-business-sdk";
import { BudgetStrategy } from "src/meta/campaign/dto/create-campaign.dto";
import { MetaTargetingDto } from "./targeting.dto";

export type AdSetStatus = typeof AdSet.Status[keyof typeof AdSet.Status];
export type AdSetBillingEvent = typeof AdSet.BillingEvent[keyof typeof AdSet.BillingEvent];
export type AdSetOptimizationGoal = typeof AdSet.OptimizationGoal[keyof typeof AdSet.OptimizationGoal];

export class CreateAdSetDto {
    @IsString()
    name: string;

    @IsString()
    campaign_id: string;

    @IsEnum(BudgetStrategy)
    strategy: BudgetStrategy;

    // ABO budgets
    @ValidateIf(o => o.strategy === BudgetStrategy.ADSET_BUDGET && !o.lifetime_budget)
    @IsNotEmpty()
    @IsNumber()
    daily_budget?: number;

    @ValidateIf(o => o.strategy === BudgetStrategy.ADSET_BUDGET && !o.daily_budget)
    @IsNotEmpty()
    @IsNumber()
    lifetime_budget?: number;

    @IsEnum(AdSet.BillingEvent)
    billing_event: AdSetBillingEvent;

    @IsEnum(AdSet.OptimizationGoal)
    optimization_goal: AdSetOptimizationGoal;

    @IsObject()
    @ValidateNested()
    @Type(() => MetaTargetingDto)
    targeting: MetaTargetingDto;

    @IsOptional()
    @IsObject()
    promoted_object?: Record<string, any>;

    @IsOptional()
    @IsEnum(AdSet.Status)
    status?: AdSetStatus;
    
    @IsDateString()
    start_time: string;
    
    @IsDateString()
    @IsOptional()
    end_time: string;
}

export class QueryAdSetDto {
    @IsString()
    ad_account_id: string;
}

