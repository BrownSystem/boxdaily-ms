import { IsString } from "class-validator";
import { BaseTransactionDto } from "../base-transaction.dto";

export class ExpenseTransferBranchDto extends BaseTransactionDto {
  @IsString()
  branchId: string;

  @IsString()
  branchName: string;

  @IsString()
  branchIdOrigen: string;

  @IsString()
  branchNameOrigen: string;
}
