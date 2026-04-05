// AUTO-GENERATED — do not edit by hand
// Source: src/meta/ads/dto/create-ad.dto.ts
import { z } from 'zod'
import { AdStatus } from './../../meta/ads/dto/create-ad.dto'

export const CreateAdDtoSchema = z.object({
  name: z.string(),
  adset_id: z.string(),
  creative_id: z.string(),
  status: z.enum(AdStatus).optional(),
})

export const QueryAdDtoSchema = z.object({
  ad_account_id: z.string(),
})

export const UpdateAdDtoSchema = z.object({
  name: z.string().optional(),
  status: z.enum(AdStatus).optional(),
})
