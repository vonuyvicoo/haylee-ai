import { IsOptional, IsString } from "class-validator";

export class FindManyBaseDto {
    @IsString()
    @IsOptional()
    integration_id?: string;
}
