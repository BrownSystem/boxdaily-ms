import { IsString } from "class-validator";
import { BaseTransactionDto } from "../base-transaction.dto";

export class ExpenseSupplierDto extends BaseTransactionDto {
  @IsString()
  voucherId: string;

  @IsString()
  voucherNumber: string;

  @IsString()
  supplierId: string;

  @IsString()
  supplierName: string;
}
