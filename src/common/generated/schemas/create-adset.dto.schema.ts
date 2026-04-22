// AUTO-GENERATED — do not edit by hand
// Source: src/modules/meta/adset/dto/create-adset.dto.ts
import { z } from 'zod'
import { AdSetBillingEvent, AdSetOptimizationGoal, AdSetStatus } from './../../../modules/meta/adset/dto/create-adset.dto'
import { BudgetStrategy } from './../../../modules/meta/campaign/dto/create-campaign.dto'
import { MetaTargetingDtoSchema } from './targeting.dto.schema'

export const CreateAdSetDtoSchema = z.object({
  name: z.string(),
  campaign_id: z.string(),
  strategy: z.enum(BudgetStrategy),
  daily_budget: z.number().optional(),
  lifetime_budget: z.number().optional(),
  billing_event: z.enum(AdSetBillingEvent),
  optimization_goal: z.enum(AdSetOptimizationGoal),
  targeting: MetaTargetingDtoSchema,
  promoted_object: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(AdSetStatus).optional(),
  start_time: z.string() /* ISO datetime */,
  end_time: z.string() /* ISO datetime */.optional(),
})

export const QueryAdSetDtoSchema = z.object({
  ad_account_id: z.string(),
})
