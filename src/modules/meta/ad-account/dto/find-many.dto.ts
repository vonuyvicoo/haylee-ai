import { FindManyBaseDto } from "@modules/meta/dto/find-many-base.dto";
import { IsOptional, IsString } from "class-validator";

export class FindManyAdAccountDto extends FindManyBaseDto {

    @IsString()
    @IsOptional()
    after?: string; // pagination token
}
