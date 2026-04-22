import { IsString } from "class-validator";

export class QueryDto {
    @IsString()
    ad_account_id: string;
}
