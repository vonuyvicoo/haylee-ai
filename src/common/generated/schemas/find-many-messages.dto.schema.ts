// AUTO-GENERATED — do not edit by hand
// Source: src/modules/message/dto/find-many-messages.dto.ts
import { z } from 'zod'
import { SortOrder, SortField } from './../../../modules/message/dto/find-many-messages.dto'

export const FindManyConversationsDtoSchema = z.object({
  size: z.number().int().min(1).max(30),
  page: z.number().int().min(1),
  sort_order: z.enum(SortOrder).default(SortOrder.DESC),
  sort_field: z.enum(SortField).default(SortField.UPDATED_AT),
})
