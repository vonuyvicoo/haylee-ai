import { FindManyBaseDto } from "@modules/meta/dto/find-many-base.dto";
import { IsOptional, IsString } from "class-validator";

export class FindManyAdsDto extends FindManyBaseDto {
    @IsString()
    ad_account_id: string;

    @IsString()
    @IsOptional()
    ad_set_id?: string;
    
    @IsString()
    @IsOptional()
    after?: string;
}
