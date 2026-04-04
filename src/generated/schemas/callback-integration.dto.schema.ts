// AUTO-GENERATED — do not edit by hand
// Source: src/integrations/dto/callback-integration.dto.ts
import { z } from 'zod'

export const CallbackIntegrationDtoSchema = z.object({
  code: z.string(),
  scopes: z.unknown().optional(),
})
