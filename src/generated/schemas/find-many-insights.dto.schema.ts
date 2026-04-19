// AUTO-GENERATED — do not edit by hand
// Source: src/meta/campaign/dto/find-many-insights.dto.ts
import { z } from 'zod'
import { MetaDatePreset } from './../../_shared/enums'

export const FindManyCampaignInsightsDtoSchema = z.object({
  date_preset: z.enum(MetaDatePreset),
})
