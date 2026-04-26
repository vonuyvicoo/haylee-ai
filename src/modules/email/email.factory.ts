import { Injectable, NotFoundException } from "@nestjs/common";
import { UserSession } from "@thallesp/nestjs-better-auth";
import { IEmailClient } from "./interfaces";
import { GmailClient } from "./clients";
import { auth } from "@core/auth";
import { PrismaService } from "@core/prisma/prisma.service";

export enum EmailProvider {
    GOOGLE = "google"
}

const emailClientMap: Record<string, (accessToken: string) => IEmailClient> = {
    [EmailProvider.GOOGLE]: (accessToken) => new GmailClient({ accessToken }),
}

@Injectable()
export class EmailFactory {

    constructor(private readonly prisma: PrismaService) {}

    async create(session: UserSession): Promise<IEmailClient> {
        const accounts = await this.prisma.account.findMany({
            where: { userId: session.user.id },
            select: { providerId: true }
        });

        const emailAccount = accounts.find(a => a.providerId in emailClientMap);
        if (!emailAccount) throw new NotFoundException("No linked email account.");

        const token = await auth.api.getAccessToken({
            body: {
                providerId: emailAccount.providerId,
                userId: session.user.id,
            },
            headers: {
                cookie: `better-auth.session_token=${session.session.token}`
            }
        });

        if (!token?.accessToken) throw new NotFoundException('Could not retrieve access token.');

        const client = emailClientMap[emailAccount.providerId](token.accessToken);
        return client;
    }
}
