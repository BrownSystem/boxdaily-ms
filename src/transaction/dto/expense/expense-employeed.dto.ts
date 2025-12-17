import { IsString } from "class-validator";
import { BaseTransactionDto } from "../base-transaction.dto";

export class ExpenseEmployeedDto extends BaseTransactionDto {
  @IsString()
  employeedId: string;

  @IsString()
  employeedName: string;
}
