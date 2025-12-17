import { IsString } from "class-validator";
import { BaseTransactionDto } from "../base-transaction.dto";

export class IncomeTransferBranchDto extends BaseTransactionDto {
  @IsString()
  branchId: string;

  @IsString()
  branchName: string;
}
