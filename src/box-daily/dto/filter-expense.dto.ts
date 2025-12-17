import { IsString, IsNumber, IsNotEmpty, IsOptional } from "class-validator";

export class FilterExpenseDto {
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsNumber()
  @IsNotEmpty()
  month: number;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsOptional()
  transactionType?: string;
}
