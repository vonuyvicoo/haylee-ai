import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../prisma/generated/prisma";
import { openAPI } from "better-auth/plugins";

const prisma = new PrismaClient();
const ENABLE_API_REF = (process.env.ENABLE_BETTERAUTH_API_REFERENCE === "true") || false;
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    ...(ENABLE_API_REF ? { plugins: [
        openAPI()
    ]}: {}),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        // TODO: don't require this
        google: {
            enabled: true,
            scope: [
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/gmail.modify',
                'https://www.googleapis.com/auth/gmail.send',
                'https://www.googleapis.com/auth/gmail.compose',
            ],
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            accessType: 'offline'
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "FREEMIUM",
                input: false
            }
        }
    },
    logger: {
        disabled: false,
        level: "debug",
        log: (level, message, ...args) => {
            console.error(`[AUTH] ${message}`);
        }
    },
    basePath: 'api/v1/auth',
    advanced: {
        crossSubDomainCookies: {
            enabled: true,
            domain: process.env.NODE_ENV === 'local' ? process.env.DOMAIN_LOCAL : (process.env.DOMAIN || "localhost")
        }
    }, trustedOrigins: (process.env.TRUSTED_ORIGINS || "http://localhost:3000").split(",")
    //advanced: { disableOriginCheck: true }
});
