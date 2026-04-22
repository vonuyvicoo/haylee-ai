import { CreateAdSetDto } from "./create-adset.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateAdSetDto extends PartialType(CreateAdSetDto) {}

