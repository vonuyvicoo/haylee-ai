// AUTO-GENERATED — do not edit by hand
// Source: src/meta/adset/dto/find-many-adset-insights.dto.ts
import { z } from 'zod'
import { MetaDatePreset } from './../../_shared/enums'

export const FindManyAdSetsInsightsDtoSchema = z.object({
  date_preset: z.enum(MetaDatePreset),
})
