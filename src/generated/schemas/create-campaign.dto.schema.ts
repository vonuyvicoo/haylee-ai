// AUTO-GENERATED — do not edit by hand
// Source: src/meta/campaign/dto/create-campaign.dto.ts
import { z } from 'zod'
import { CampaignObjectiveValue, CampaignStatus, BudgetStrategy, CampaignBidStrategy, CampaignSpecialAdCategory } from './../../meta/campaign/dto/create-campaign.dto'

export const CreateCampaignDtoSchema = z.object({
  name: z.string(),
  objective: z.enum(CampaignObjectiveValue),
  status: z.enum(CampaignStatus).default(CampaignStatus.PAUSED),
  strategy: z.enum(BudgetStrategy),
  is_adset_budget_sharing_enabled: z.boolean().optional(),
  daily_budget: z.number().optional(),
  lifetime_budget: z.number().optional(),
  bid_strategy: z.enum(CampaignBidStrategy),
  special_ad_categories: z.array(z.enum(CampaignSpecialAdCategory)).default([CampaignSpecialAdCategory.NONE]),
})

export const QueryCampaignDtoSchema = z.object({
  ad_account_id: z.string(),
})
