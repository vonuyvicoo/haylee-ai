import { IsOptional, IsString } from "class-validator";
import { FindManyBaseDto } from "src/meta/dto/find-many-base.dto";

export class FindManyAdAccountDto extends FindManyBaseDto {

    @IsString()
    @IsOptional()
    after?: string; // pagination token
}
