import z from "zod";

export const SendEmailSchema = z.object({
    subject: z.string(),
    to: z.array(z.string()),
    cc: z.array(z.string()),
    bcc: z.array(z.string()),
    html: z.string().optional(),
    text: z.string().optional(),
    senderName: z.string()
})

export type SendEmailParams = z.infer<typeof SendEmailSchema>

export interface IEmailClient {
    send(params: SendEmailParams): Promise<any>;
}
