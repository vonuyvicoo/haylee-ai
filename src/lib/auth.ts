import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
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
            domain: process.env.DOMAIN || "localhost"
        }
    }, trustedOrigins: (process.env.TRUSTED_ORIGINS || "http://localhost:3000").split(",")
    //advanced: { disableOriginCheck: true }
});
