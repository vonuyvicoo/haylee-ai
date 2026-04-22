// AUTO-GENERATED — do not edit by hand
// Source: src/modules/meta/ad-creative/dto/update-adcreative.dto.ts
import { z } from 'zod'

export const UpdateAdCreativeDtoSchema = z.object({
  name: z.string().optional(),
  status: z.string() /* AdCreative.Status */.optional(),
})
