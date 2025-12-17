import { IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateBoxCategoryDto {
  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
