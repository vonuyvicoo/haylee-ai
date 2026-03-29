import { IsEmail, IsEnum, IsString, IsUUID } from "class-validator";

export class CreateSubscriptionDto {
    @IsString()
    @IsUUID()
    course_id: string;
    @IsString()
    name: string;
    @IsEmail()
    email: string;
}
