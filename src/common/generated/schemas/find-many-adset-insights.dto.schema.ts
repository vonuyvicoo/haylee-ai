// AUTO-GENERATED — do not edit by hand
// Source: src/modules/meta/adset/dto/find-many-adset-insights.dto.ts
import { z } from 'zod'
import { MetaDatePreset } from './../../enums'

export const FindManyAdSetsInsightsDtoSchema = z.object({
  date_preset: z.enum(MetaDatePreset),
})
