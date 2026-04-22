// AUTO-GENERATED — do not edit by hand
// Source: src/modules/meta/ads/dto/find-many-ad-insights.dto.ts
import { z } from 'zod'
import { MetaDatePreset } from './../../enums'

export const FindManyAdInsightsDtoSchema = z.object({
  date_preset: z.enum(MetaDatePreset),
})
