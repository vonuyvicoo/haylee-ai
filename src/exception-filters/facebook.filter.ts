import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";

interface FacebookErrorResponse {
    message: string;
    type?: string;
    code?: number;
    error_subcode?: number;
    error_user_title?: string;
    error_user_msg?: string;
    fbtrace_id?: string;
}

interface FacebookRequestError extends Error {
    name: 'FacebookRequestError';
    status: number;
    response: FacebookErrorResponse;
}

function isFacebookRequestError(err: unknown): err is FacebookRequestError {
    return (
        typeof err === 'object' &&
        err !== null &&
        (err as FacebookRequestError).name === 'FacebookRequestError'
    );
}

@Catch()
export class FacebookRequestErrorFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        if (!isFacebookRequestError(exception)) {
            return super.catch(exception, host);
        }

        const ctx      = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request  = ctx.getRequest<Request>();

        const fbResponse = exception.response;
        const status     = exception.status ?? HttpStatus.BAD_REQUEST;

        // Prefer the human-readable title Meta provides; fall back to the raw message
        const userTitle = fbResponse?.error_user_title;
        const message   = userTitle && userTitle !== 'Unknown error'
            ? userTitle
            : (fbResponse?.message ?? exception.message ?? 'Facebook API error');

        response.status(status).json({
            statusCode: status,
            message,
            error:      'FACEBOOK_API_ERROR',
            meta: {
                code:          fbResponse?.code,
                error_subcode: fbResponse?.error_subcode,
                type:          fbResponse?.type,
                fbtrace_id:    fbResponse?.fbtrace_id,
                path:          request.originalUrl,
            },
        });
    }
}
