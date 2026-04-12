// AUTO-GENERATED — do not edit by hand
// Source: src/meta/adset/dto/targeting.dto.ts
import { z } from 'zod'

export const TargetingRegionDtoSchema = z.object({
  key: z.string(),
})

export const TargetingCityDtoSchema = z.object({
  key: z.string(),
  radius: z.number().int().min(1).optional(),
  distance_unit: z.union([z.literal("mile"), z.literal("kilometer")]).optional(),
})

export const TargetingAutomationDtoSchema = z.object({
  advantage_audience: z.number().min(0).max(1),
})

export const TargetingGeoLocationsDtoSchema = z.object({
  countries: z.array(z.string().length(2)).optional(),
  regions: z.array(TargetingRegionDtoSchema).optional(),
  cities: z.array(TargetingCityDtoSchema).optional(),
})

export const TargetingInterestDtoSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
})

export const TargetingBehaviorDtoSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
})

export const TargetingFlexibleSpecItemDtoSchema = z.object({
  interests: z.array(TargetingInterestDtoSchema).optional(),
  behaviors: z.array(TargetingBehaviorDtoSchema).optional(),
})

export const MetaTargetingDtoSchema = z.object({
  geo_locations: TargetingGeoLocationsDtoSchema,
  age_min: z.number().int().min(13).max(65).optional(),
  age_max: z.number().int().min(13).max(65).optional(),
  targeting_automation: TargetingAutomationDtoSchema.optional(),
  genders: z.array(z.number().int()).optional(),
  flexible_spec: z.array(TargetingFlexibleSpecItemDtoSchema).optional(),
  publisher_platforms: z.array(z.string()).optional(),
  facebook_positions: z.array(z.string()).optional(),
  instagram_positions: z.array(z.string()).optional(),
})
