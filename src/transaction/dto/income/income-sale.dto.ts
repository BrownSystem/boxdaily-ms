import { IsString } from "class-validator";
import { BaseTransactionDto } from "../base-transaction.dto";

export class IncomeSaleDto extends BaseTransactionDto {
  @IsString()
  voucherId: string;

  @IsString()
  voucherNumber: string;

  @IsString()
  clientId: string;

  @IsString()
  clientName: string;
}
