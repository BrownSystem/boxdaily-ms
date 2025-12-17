import { IsString } from "class-validator";
import { BaseTransactionDto } from "../base-transaction.dto";

export class IncomeFromVoucherCancellationDto extends BaseTransactionDto {
  @IsString()
  voucherId: string;

  @IsString()
  cancelledInvoiceNumber: string;

  @IsString()
  voucherNumber: string;

  @IsString()
  supplierId: string;

  @IsString()
  supplierName: string;
}
