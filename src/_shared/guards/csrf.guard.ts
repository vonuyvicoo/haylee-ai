import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnsupportedMediaTypeException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";

@Injectable()
export class CSRFGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly reflector: Reflector,
    ) {
    }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();

        const allowMultipart = this.reflector.getAllAndOverride<boolean>(
            "allow_multipart",
            [context.getHandler(), context.getClass()],
        );

        const method = req.method;
        if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
            return true;
        }

        const origin = req.headers.origin || req.headers.referer;
        const site = req.headers["sec-fetch-site"];
        const contentType = req.headers["content-type"];

        const trustedOrigins = this.configService
        .getOrThrow<string>("TRUSTED_ORIGINS")
        .split(",")
        .map(o => o.trim());

        const parsedOrigin = this.extractOrigin(origin);
        console.log("ran origin: ", parsedOrigin);

        if (!parsedOrigin || !trustedOrigins.includes(parsedOrigin)) {
            throw new ForbiddenException("Invalid origin");
        }

        if (site && site !== "same-origin" && site !== "same-site") {
            throw new ForbiddenException("Blocked cross-site request");
        }

        const isJson = contentType?.includes("application/json");
        const isMultipart = contentType?.includes("multipart/form-data");

        if (!isJson && !(isMultipart && allowMultipart)) {
            throw new UnsupportedMediaTypeException("Invalid content type");
        }

        return true;
    }

    private extractOrigin(value?: string): string | null {
        if (!value) return null;

        try {
            return new URL(value).origin;
        } catch {
            return null;
        }
    }
}
