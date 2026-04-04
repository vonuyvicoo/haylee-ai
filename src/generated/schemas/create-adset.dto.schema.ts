// AUTO-GENERATED — do not edit by hand
// Source: src/meta/adset/dto/create-adset.dto.ts
import { z } from 'zod'
import { BudgetStrategy } from './../../meta/campaign/dto/create-campaign.dto'
import { MetaTargetingDtoSchema } from './targeting.dto.schema'

export const CreateAdSetDtoSchema = z.object({
  name: z.string(),
  campaign_id: z.string(),
  strategy: z.enum(BudgetStrategy),
  daily_budget: z.number().optional(),
  lifetime_budget: z.number().optional(),
  billing_event: z.string() /* AdSet.BillingEvent */,
  optimization_goal: z.string() /* AdSet.OptimizationGoal */,
  targeting: MetaTargetingDtoSchema,
  promoted_object: z.record(z.string(), z.unknown()).optional(),
  status: z.string() /* AdSet.Status */.optional(),
  start_time: z.string() /* ISO datetime */,
  end_time: z.string() /* ISO datetime */.optional(),
})

export const QueryAdSetDtoSchema = z.object({
  ad_account_id: z.string(),
})
