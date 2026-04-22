// AUTO-GENERATED — do not edit by hand
// Source: src/modules/meta/adset/dto/find-many-target.dto.ts
import { z } from 'zod'
import { TargetType, TargetClass } from './../../../modules/meta/adset/dto/find-many-target.dto'

export const FindManyTargetingOptionsDtoSchema = z.object({
  type: z.enum(TargetType),
  class: z.enum(TargetClass),
  query: z.string().optional(),
})
