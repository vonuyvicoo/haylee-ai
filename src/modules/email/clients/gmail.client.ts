import { IEmailClient, SendEmailParams } from "../interfaces/email-client.interface";
import { google } from "googleapis";
import { GmailMessageBuilder } from "../builders/gmail.builder";

export type GmailAuthParams = {
    accessToken: string;
}

export class GmailClient implements IEmailClient {
    private auth: GmailAuthParams;

    constructor(auth: GmailAuthParams) {
        this.auth = auth;
    }

    async send(params: SendEmailParams): Promise<any> {
        const cred = new google.auth.OAuth2();
        cred.setCredentials({
            access_token: this.auth.accessToken
        });

        const gmail = google.gmail({
            version: 'v1',
            auth: cred
        });

        const rawMessage = GmailMessageBuilder
        .create()
        .setFrom(params.senderName)
        .setTo(params.to.join(","))
        .setSubject(params.subject)
        .setHtml(params.html)
        .setText(params.text)
        .build();

        return await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: rawMessage
            }
        });

    }
}
