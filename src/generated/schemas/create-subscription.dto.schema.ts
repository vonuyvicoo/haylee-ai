// AUTO-GENERATED — do not edit by hand
// Source: src/subscriptions/dto/create-subscription.dto.ts
import { z } from 'zod'

export const CreateSubscriptionDtoSchema = z.object({
  course_id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
})
