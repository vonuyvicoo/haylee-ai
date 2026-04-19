// AUTO-GENERATED — do not edit by hand
// Source: src/meta/ads/dto/find-many-ad-insights.dto.ts
import { z } from 'zod'
import { MetaDatePreset } from './../../_shared/enums'

export const FindManyAdInsightsDtoSchema = z.object({
  date_preset: z.enum(MetaDatePreset),
})
