import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

export enum SortOrder {
    DESC = "desc",
    ASC = "asc"
}

export enum SortField {
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at"
}

export class FindManyConversationsDto {
    @IsInt()
    @Min(1) 
    @Max(30)
    size: number = 10;
    @IsInt()
    @Min(1)
    page: number = 1;
    @IsEnum(SortOrder)
    @IsOptional()
    sort_order: SortOrder = SortOrder.DESC;
    @IsEnum(SortField)
    @IsOptional()
    sort_field: SortField = SortField.UPDATED_AT;
}
