// AUTO-GENERATED — do not edit by hand
// Source: src/modules/message/dto/create-message.dto.ts
import { z } from 'zod'
import { IRole } from './../../../modules/message/dto/create-message.dto'

export const CreateMessageDtoSchema = z.object({
  message: z.string(),
  conversation_id: z.string().optional(),
})

export const IHistoryPayloadSchema = z.object({
  role: z.enum(IRole),
  content: z.string(),
})
