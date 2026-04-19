// AUTO-GENERATED — do not edit by hand
// Source: src/user/dto/update-user.dto.ts
import { z } from 'zod'
import { Role } from './../../user/types'

export const UpdateUserDtoSchema = z.object({
  name: z.string().optional(),
  role: z.enum(Role).optional(),
})
