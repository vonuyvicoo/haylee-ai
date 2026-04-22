import { IsEnum, IsOptional, IsString, } from "class-validator";

export class CreateMessageDto {
    @IsString()
    message: string;
    @IsString()
    @IsOptional()
    conversation_id?: string;
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
