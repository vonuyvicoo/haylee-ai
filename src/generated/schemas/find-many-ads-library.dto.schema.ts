// AUTO-GENERATED — do not edit by hand
// Source: src/meta/adlibrary/dto/find-many-ads-library.dto.ts
import { z } from 'zod'
import { AdLibraryAdStatus } from './../../meta/adlibrary/dto/find-many-ads-library.dto'
import { CountryCode } from './../../_shared/enums'

export const FindManyAdsLibraryDtoSchema = z.object({
  ad_active_status: z.enum(AdLibraryAdStatus).default(AdLibraryAdStatus.ALL),
  ad_reached_countries: z.array(z.enum(CountryCode)).default([CountryCode.ALL]),
})
