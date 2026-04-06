import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Validate, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { BudgetStrategy } from "src/meta/campaign/dto/create-campaign.dto";
import { MetaTargetingDto } from "./targeting.dto";
import { BillingEventGoalValidatorConstraint } from "../validators/billing-event-goal.validator";

export enum AdSetStatus {
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    DELETED = "DELETED",
    ARCHIVED = "ARCHIVED"
}

export enum AdSetBillingEvent {
    NONE = "NONE",
    CLICKS = "CLICKS",
    PURCHASE = "PURCHASE",
    THRUPLAY = "THRUPLAY",
    PAGE_LIKES = "PAGE_LIKES",
    IMPRESSIONS = "IMPRESSIONS",
    LINK_CLICKS = "LINK_CLICKS",
    APP_INSTALLS = "APP_INSTALLS",
    OFFER_CLAIMS = "OFFER_CLAIMS", 
    POST_ENGAGEMENT = "POST_ENGAGEMENT", 
    LISTING_INTERACTION = "LISTING_INTERACTION"
}

export enum AdSetOptimizationGoal {
    THRUPLAY = "THRUPLAY",
    POST_ENGAGEMENT = "POST_ENGAGEMENT",
    APP_INSTALLS = "APP_INSTALLS",
    LINK_CLICKS = "LINK_CLICKS",
    IMPRESSIONS = "IMPRESSIONS",
    PAGE_LIKES = "PAGE_LIKES",
    NONE = "NONE",
    REACH = "REACH",
    VALUE = "VALUE",
    SUBSCRIBERS = "SUBSCRIBERS",
    IN_APP_VALUE = "IN_APP_VALUE",
    QUALITY_CALL = "QUALITY_CALL",
    QUALITY_LEAD = "QUALITY_LEAD",
    CONVERSATIONS = "CONVERSATIONS",
    ENGAGED_USERS = "ENGAGED_USERS",
    PROFILE_VISIT = "PROFILE_VISIT",
    REMINDERS_SET = "REMINDERS_SET",
    AD_RECALL_LIFT = "AD_RECALL_LIFT",
    DERIVED_EVENTS = "DERIVED_EVENTS",
    EVENT_RESPONSES = "EVENT_RESPONSES",
    LEAD_GENERATION = "LEAD_GENERATION",
    LANDING_PAGE_VIEWS = "LANDING_PAGE_VIEWS",
    AUTOMATIC_OBJECTIVE = "AUTOMATIC_OBJECTIVE",
    OFFSITE_CONVERSIONS = "OFFSITE_CONVERSIONS",
    ADVERTISER_SILOED_VALUE = "ADVERTISER_SILOED_VALUE",
    MEANINGFUL_CALL_ATTEMPT = "MEANINGFUL_CALL_ATTEMPT",
    VISIT_INSTAGRAM_PROFILE = "VISIT_INSTAGRAM_PROFILE",
    PROFILE_AND_PAGE_ENGAGEMENT = "PROFILE_AND_PAGE_ENGAGEMENT",
    MESSAGING_PURCHASE_CONVERSION = "MESSAGING_PURCHASE_CONVERSION",
    MESSAGING_APPOINTMENT_CONVERSION = "MESSAGING_APPOINTMENT_CONVERSION",
    APP_INSTALLS_AND_OFFSITE_CONVERSIONS = "APP_INSTALLS_AND_OFFSITE_CONVERSIONS",
}

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

    @IsEnum(AdSetBillingEvent)
    @Validate(BillingEventGoalValidatorConstraint)
    billing_event: AdSetBillingEvent;

    @IsEnum(AdSetOptimizationGoal)
    optimization_goal: AdSetOptimizationGoal;

    @IsObject()
    @ValidateNested()
    @Type(() => MetaTargetingDto)
    targeting: MetaTargetingDto;

    @IsOptional()
    @IsObject()
    promoted_object?: Record<string, any>;

    @IsOptional()
    @IsEnum(AdSetStatus)
    status?: AdSetStatus;
    
    @IsDateString()
    start_time: string;
    
    @IsDateString()
    @IsOptional()
    end_time?: string;
}

export class QueryAdSetDto {
    @IsString()
    ad_account_id: string;
}

