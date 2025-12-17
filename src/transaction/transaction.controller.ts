import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TransactionService } from './transaction.service';

import { ExpenseByCategory } from './dto/expense/expense-by-category.dto';
import { ExpenseEmployeedDto } from './dto/expense/expense-employeed.dto';
import { ExpenseSupplierDto } from './dto/expense/expense-supplier.dto';
import { ExpenseTransferBranchDto } from './dto/expense/expense-transfer-branch.dto';

import { IncomeSaleDto } from './dto/income/income-sale.dto';
import { IncomeTransferBranchDto } from './dto/income/income-transfer-branch.dto';

@Controller()
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
  ) {}

  @MessagePattern({ cmd: 'get_income_by_payment_method' })
  getIncomeByPaymentMethod(@Payload() payload: { branchId: string }) {
    return this.transactionService.getIncomeByPaymentMethod(payload?.branchId);
  }

  @MessagePattern({ cmd: 'load_transaction_type_voucher' })
  loadTransactionTypeVoucher(@Payload() payload: any) {
    return this.transactionService.loadTransactionTypeVoucher(payload);
  }

  @MessagePattern({ cmd: 'expense_by_category' })
  expenseByCategory(
    @Payload() expenseByCategoryDto: ExpenseByCategory,
  ) {
    return this.transactionService.expenseByCategory(expenseByCategoryDto);
  }

  @MessagePattern({ cmd: 'expense_employeed' })
  expenseEmployeed(
    @Payload() expenseEmployeedDto: ExpenseEmployeedDto,
  ) {
    return this.transactionService.expenseEmployeed(expenseEmployeedDto);
  }

  @MessagePattern({ cmd: 'expense_supplier' })
  expenseSupplier(
    @Payload() expenseSupplierDto: ExpenseSupplierDto,
  ) {
    return this.transactionService.expenseSupplier(expenseSupplierDto);
  }

  @MessagePattern({ cmd: 'expense_trasnfer_branch' })
  expenseTransferBranch(
    @Payload() expenseTransferBranchDto: ExpenseTransferBranchDto,
  ) {
    return this.transactionService.expenseTransferBranch(
      expenseTransferBranchDto,
    );
  }

  @MessagePattern({ cmd: 'income_sale' })
  incomeSale(
    @Payload() incomeSaleDto: IncomeSaleDto,
  ) {
    return this.transactionService.incomeSale(incomeSaleDto);
  }

  @MessagePattern({ cmd: 'income_transfer_branch' })
  incomeTransferBranch(
    @Payload() incomeTransferBranchDto: IncomeTransferBranchDto,
  ) {
    return this.transactionService.incomeTransferBranch(
      incomeTransferBranchDto,
    );
  }

  @MessagePattern({ cmd: 'transaction_deletion' })
  transactionDeletion(@Payload() payload: { id: string }) {
    return this.transactionService.deleteTransaction(payload?.id);
  }
}
