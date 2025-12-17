import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsOptional } from "class-validator";
import { CreateBoxCategoryDto } from "./create-box-category.dto";

export class UpdateBoxCategoryDto extends PartialType(CreateBoxCategoryDto) {
  @IsString()
  @IsOptional()
  id?: string;
}
