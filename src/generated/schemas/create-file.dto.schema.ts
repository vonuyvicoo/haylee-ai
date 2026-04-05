// AUTO-GENERATED — do not edit by hand
// Source: src/files/dto/create-file.dto.ts
import { z } from 'zod'

export const CreateFileDtoSchema = z.object({
  title: z.string(),
  type: z.string().optional(),
})
