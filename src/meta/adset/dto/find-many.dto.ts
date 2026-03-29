import { IsOptional, IsString } from "class-validator";
import { FindManyBaseDto } from "src/meta/dto/find-many-base.dto";

export class FindManyAdSetDto extends FindManyBaseDto {
    @IsString()
    ad_account_id: string;
    
    @IsString()
    @IsOptional()
    after?: string;
}
