import { IsString } from "class-validator";
import { CredentialType, IntegrationType } from "prisma/generated/prisma";

export class CreateIntegrationDto {
    @IsString()
    name: string;
}
