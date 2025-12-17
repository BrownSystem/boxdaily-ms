import { IsString } from "class-validator";
import { BaseTransactionDto } from "../base-transaction.dto";

export class ExpenseByCategory extends BaseTransactionDto {
  @IsString()
  categoryId: string;

  @IsString()
  categoryName: string;
}
