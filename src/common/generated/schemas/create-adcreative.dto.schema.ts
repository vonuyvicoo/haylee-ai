// AUTO-GENERATED — do not edit by hand
// Source: src/modules/meta/ad-creative/dto/create-adcreative.dto.ts
import { z } from 'zod'
import { CallToActionType } from './../../../modules/meta/ad-creative/dto/create-adcreative.dto'

export const CreateAdCreativeDtoSchema = z.object({
  name: z.string(),
  page_id: z.string(),
  message: z.string().optional(),
  headline: z.string().optional(),
  description: z.string().optional(),
  link_url: z.string().optional(),
  picture: z.string().optional(),
  image_hash: z.string().optional(),
  video_id: z.string().optional(),
  call_to_action_type: z.enum(CallToActionType).optional(),
  instagram_actor_id: z.string().optional(),
})

export const QueryAdCreativeDtoSchema = z.object({
  ad_account_id: z.string(),
  after: z.string().optional(),
})
