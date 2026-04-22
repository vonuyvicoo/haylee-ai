import { CampaignEffectiveStatus, CampaignStatus } from "./dto/create-campaign.dto";

export enum MetaDelivery {
    DRAFTS = "DRAFTS",
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    NOT_DELIVERING = "NOT_DELIVERING",
    DELETED = "DELETED",
    COMPLETED = "COMPLETED",
    OFF = "OFF"
}

export type MetaCampaign = {
    id: string; 
    name: string;
    status: CampaignStatus;
    effective_status: CampaignEffectiveStatus;
    daily_budget: string;
    start_time: string;
    delivery: MetaDelivery;
}
