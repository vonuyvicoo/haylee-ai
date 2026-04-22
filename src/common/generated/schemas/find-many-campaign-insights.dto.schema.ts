// AUTO-GENERATED — do not edit by hand
// Source: src/modules/meta/campaign/dto/find-many-campaign-insights.dto.ts
import { z } from 'zod'
import { MetaDatePreset } from './../../enums'

export const FindManyCampaignInsightsDtoSchema = z.object({
  date_preset: z.enum(MetaDatePreset),
})
