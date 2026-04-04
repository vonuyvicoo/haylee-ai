import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested, } from "class-validator";

export class CreateMessageDto {
    @IsString()
    message: string;
    @IsOptional()
    @Type(() => IHistoryPayload)
    conversation_history: IHistoryPayload[];
}

export enum IRole {
    HUMAN = "human",
    AI = "ai"
}

export class IHistoryPayload {
    @IsEnum(IRole)
    role: IRole;
    @IsString()
    content: string;
};
