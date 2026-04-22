import { FindManyBaseDto } from "@modules/meta/dto/find-many-base.dto";
import { IsOptional, IsString } from "class-validator";

export class FindManyAdSetDto extends FindManyBaseDto {
    @IsString()
    ad_account_id: string;

    @IsString()
    @IsOptional()
    campaign_id?: string;
    
    @IsString()
    @IsOptional()
    after?: string;
}
