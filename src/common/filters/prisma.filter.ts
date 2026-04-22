import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { Prisma } from "prisma/generated/prisma";

export const errorMappings: Record<string, { status: number; message: string }> = {
    P2000: { status: HttpStatus.BAD_REQUEST, message: "Input Data is too long" },
    P2001: { status: HttpStatus.NO_CONTENT, message: "Record does not exist" },
    P2002: { status: HttpStatus.CONFLICT, message: "Reference Data already exists" },
    P2025: { status: HttpStatus.NOT_FOUND, message: "You're trying to perform an operation on a resource that doesn't exist."}
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter  extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const errorCode = exception.code
        const errorMapping = errorMappings[errorCode];

        if (errorMapping) {
            const { status, message } = errorMapping;
            response.status(status).json({
                statusCode: status,
                message: `${message} at path: ${
request.originalUrl.split("/")[request.originalUrl.split("/").length - 1]
}, Error Code: ${errorCode}`,
                error: "BUSINESS_ERROR"
            });
        } else {
            exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
            super.catch(exception, host); // Handle unknown error codes
        }
    }
}
