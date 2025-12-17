import { Type } from "class-transformer";
import {
  IsPositive,
  IsOptional,
  IsDate,
  IsString,
  IsNumber,
  IsEnum,
} from "class-validator";
import { BoxStatus } from "../../enum/status.enum";

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  offset: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateUntil?: Date;

  @IsString()
  @IsOptional()
  branch?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  number?: number;

  @IsEnum(BoxStatus)
  @IsOptional()
  status?: BoxStatus;

  constructor(partial: Partial<PaginationDto> = {}) {
    Object.assign(this, partial);
    this.limit = partial?.limit || 10;
    this.offset = partial?.offset || 1;
  }
}
