import { IsOptional, IsString } from "class-validator";

export class CallbackIntegrationDto {
    @IsString()
    code: string;
    @IsOptional()
    scopes?: string;
}
