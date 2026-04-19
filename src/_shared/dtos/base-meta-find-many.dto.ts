import { IsString } from "class-validator";

export class BaseMetaFindManyDto {
    @IsString()
    ad_account_id: string;
}
