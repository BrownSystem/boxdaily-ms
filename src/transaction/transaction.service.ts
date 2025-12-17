import { Injectable, Logger, HttpStatus } from "@nestjs/common";
import {
  PrismaClient,
  $Enums,
  TransactionType,
  PaymentMethod,
} from "@prisma/client";
import { VoucherType } from "src/enum/voucher-type.enum";

@Injectable()
export class TransactionService extends PrismaClient {
  private readonly logger = new Logger(TransactionService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log("Database connected successfully");
  }

  // Helper: Actualiza totales de la caja
  async updateBoxTotals(
    boxId: string,
    updates: {
      income?: number;
      totalExpenses?: number;
      totalSales?: number;
    }
  ) {
    const boxIsOpen = await this.eBoxDaily.findFirst({
      where: { id: boxId, status: "OPEN", available: true },
    });

    if (!boxIsOpen) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `[ACCES_TO_BOX_DAILY] No se puede vincular la transacción con esta caja.`,
      };
    }

    const update = await this.eBoxDaily.update({
      where: {
        id: boxIsOpen.id,
      },
      data: {
        ...(updates.income && { income: { increment: updates.income } }),
        ...(updates.totalExpenses && {
          totalExpenses: { increment: updates.totalExpenses },
        }),
        ...(updates.totalSales && {
          totalSales: { increment: updates.totalSales },
        }),
      },
    });

    return true;
  }

  // Enrutador: Carga transacciones según tipo de comprobante
  async loadTransactionTypeVoucher(payload: {
    type: VoucherType;
    voucherId?: string;
    voucherNumber?: string;
    contactId?: string;
    contactName?: string;
    boxId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    description?: string;
    currency?: string;
    paymentId?: string;
    cancelledInvoiceNumber?: string;
  }) {
    if (payload?.type === "FACTURA") {
      return this.expenseSupplier({
        voucherId: payload?.voucherId,
        voucherNumber: payload?.voucherNumber,
        supplierId: payload?.contactId,
        supplierName: payload?.contactName,
        boxId: payload?.boxId,
        amount: payload?.amount,
        paymentMethod: payload?.paymentMethod,
        description: payload?.description,
        currency: payload?.currency,
        paymentId: payload?.paymentId,
      });
    } else if (payload?.type === "NOTA_CREDITO_PROVEEDOR") {
      return this.incomeFromVoucherCancellation({
        voucherId: payload?.voucherId,
        voucherNumber: payload?.voucherNumber,
        cancelledInvoiceNumber: payload?.cancelledInvoiceNumber,
        supplierId: payload?.contactId,
        supplierName: payload?.contactName,
        boxId: payload?.boxId,
        amount: payload?.amount,
        paymentMethod: payload?.paymentMethod,
        description: payload?.description,
        currency: payload?.currency,
        paymentId: payload?.paymentId,
      });
    } else if (payload?.type === "P") {
      return this.incomeSale({
        voucherId: payload?.voucherId,
        voucherNumber: payload?.voucherNumber,
        clientId: payload?.contactId,
        clientName: payload?.contactName,
        boxId: payload?.boxId,
        amount: payload?.amount,
        paymentMethod: payload?.paymentMethod,
        description: payload?.description,
        currency: payload?.currency,
        paymentId: payload?.paymentId,
      });
    } else if (payload?.type === "NOTA_CREDITO_CLIENTE") {
      return this.expenseFromVoucherPCancellation({
        voucherId: payload?.voucherId,
        voucherNumber: payload?.voucherNumber,
        cancelledInvoiceNumber: payload?.cancelledInvoiceNumber,
        clientId: payload?.contactId,
        clientName: payload?.contactName,
        boxId: payload?.boxId,
        amount: payload?.amount,
        paymentMethod: payload?.paymentMethod,
        description: payload?.description,
        currency: payload?.currency,
        paymentId: payload?.paymentId,
      });
    }
  }

  // Reporte: Ingresos por método de pago
  getIncomeByPaymentMethod = async (branchId: string) => {
    if (!branchId) {
      return {
        message: "[GET_INCOME_BY_PAYMENT_METHOD] branchId is required",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const incomeTypes: TransactionType[] = [
      "INCOME_SALE",
      "INCOME_TRANSFER_BRANCH",
      "INCOME_FROM_VOUCHER_CANCELLATION",
    ];

    const boxDaily = await this.eBoxDaily.findFirst({
      where: { branchId, status: "OPEN" },
      include: { transactions: true },
    });

    if (!boxDaily) {
      return {
        message: `[GET_INCOME_BY_PAYMENT_METHOD] No se encontró caja diaria para la sucursal ${branchId}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const formatted: Record<string, number> = {};

    for (const method of Object.values(PaymentMethod)) {
      formatted[method] = 0;
    }

    for (const tx of boxDaily.transactions) {
      if (incomeTypes.includes(tx?.transactionType) && tx.available) {
        const method = tx.paymentMethod;
        if (method) {
          formatted[method] += tx.amount;
        }
      }
    }

    return formatted;
  };

  // GASTOS
  async expenseByCategory(expenseByCategoryDto: any) {
    try {
      const { boxId, amount } = expenseByCategoryDto;

      const expense = await this.eBoxTransaction.create({
        data: {
          ...expenseByCategoryDto,
          transactionType: "EXPENSE_BY_CATEGORY",
        },
      });

      if (expense) {
        await this.updateBoxTotals(boxId, { totalExpenses: amount });
      }

      return expense;
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `[EXPENSE_BY_CATEGORY] No se puedo crear esta transacción ${error}`,
      };
    }
  }

  async expenseEmployeed(expenseEmployeedDto: any) {
    try {
      const { boxId, amount } = expenseEmployeedDto;

      const expense = await this.eBoxTransaction.create({
        data: {
          ...expenseEmployeedDto,
          transactionType: "EXPENSE_EMPLOYEED",
        },
      });

      if (expense) {
        await this.updateBoxTotals(boxId, { totalExpenses: amount });
      }

      return expense;
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `[EXPENSE_EMPLOYEED] No se puedo crear esta transacción ${error}`,
      };
    }
  }

  async expenseSupplier(expenseSupplierDto: any) {
    try {
      const { boxId, amount } = expenseSupplierDto;

      const expense = await this.eBoxTransaction.create({
        data: {
          ...expenseSupplierDto,
          transactionType: "EXPENSE_SUPPLIER",
        },
      });

      if (expense) {
        await this.updateBoxTotals(boxId, { totalExpenses: amount });
      }

      return expense;
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `[EXPENSE_SUPPLIER] No se puedo crear esta transacción`,
      };
    }
  }

  async expenseFromVoucherPCancellation(
    expenseFromVoucherPCancellationDto: any
  ) {
    try {
      const { boxId, amount } = expenseFromVoucherPCancellationDto;

      const expense = await this.eBoxTransaction.create({
        data: {
          ...expenseFromVoucherPCancellationDto,
          transactionType: "EXPENSE_FROM_VOUCHER_P_CANCELLATION",
        },
      });

      if (expense) {
        await this.updateBoxTotals(boxId, {
          income: -amount,
          totalSales: -amount,
        });
      }

      return expense;
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `[INCOME_FROM_VOUCHER_CANCELLATION] No se puedo crear esta transacción`,
      };
    }
  }

  async expenseTransferBranch(expenseTransferBranchDto: any) {
    try {
      const {
        boxId,
        amount,
        branchId,
        paymentId,
        paymentMethod,
        description,
        currency,
        branchIdOrigen,
        branchNameOrigen,
      } = expenseTransferBranchDto;

      if (branchId) {
        const branchOffice = await this.eBoxDaily.findFirst({
          where: {
            branchId,
            status: "OPEN",
            available: true,
          },
        });

        if (!branchOffice) {
          return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: `[EXPENSE_TRANSFER_BRANCH] Sucursal sin caja abierta. Seleccioná otra.`,
          };
        }

        const destination = await this.incomeTransferBranch({
          boxId: branchOffice.id,
          amount,
          branchId: branchIdOrigen,
          branchName: branchNameOrigen,
          paymentId,
          paymentMethod,
          description,
          currency,
        });
      }

      const expense = await this.eBoxTransaction.create({
        data: {
          boxId,
          branchId,
          branchName: expenseTransferBranchDto.branchName,
          amount,
          description,
          paymentMethod,
          currency,
          transactionType: TransactionType.EXPENSE_TRANSFER_BRANCH,
        },
      });

      console.log(expense);

      if (expense) {
        await this.updateBoxTotals(boxId, { totalExpenses: amount });
      }

      return expense;
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `[EXPENSE_TRANSFER_BRANCH] No se puedo crear esta transacción`,
      };
    }
  }

  // INGRESOS
  async incomeSale(incomeSaleDto: any) {
    try {
      const { boxId, amount } = incomeSaleDto;

      const income = await this.eBoxTransaction.create({
        data: {
          ...incomeSaleDto,
          transactionType: "INCOME_SALE",
        },
      });

      if (income) {
        await this.updateBoxTotals(boxId, {
          income: amount,
          totalSales: amount,
        });
      }

      return income;
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `[INCOME_SALE] No se puedo crear esta transacción`,
      };
    }
  }

  async incomeFromVoucherCancellation(incomeFromVoucherCancellationDto: any) {
    try {
      const { boxId, amount } = incomeFromVoucherCancellationDto;

      const income = await this.eBoxTransaction.create({
        data: {
          ...incomeFromVoucherCancellationDto,
          transactionType: "INCOME_FROM_VOUCHER_CANCELLATION",
        },
      });

      if (income) {
        await this.updateBoxTotals(boxId, {
          totalExpenses: -amount,
        });
      }

      return income;
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `[INCOME_FROM_VOUCHER_CANCELLATION] No se puedo crear esta transacción`,
      };
    }
  }

  async incomeTransferBranch(incomeTransferBranchDto: any) {
    try {
      const { boxId, amount } = incomeTransferBranchDto;

      const income = await this.eBoxTransaction.create({
        data: {
          ...incomeTransferBranchDto,
          transactionType: "INCOME_TRANSFER_BRANCH",
        },
      });

      if (income) {
        await this.updateBoxTotals(boxId, { income: amount });
      }

      return income;
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `[INCOME_TRANSFER_BRANCH] No se puedo crear esta transacción`,
      };
    }
  }

  // ELIMINAR TRANSACCIÓN (con rollback de totales)
  async deleteTransaction(id: string) {
    if (!id) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: "[TRANSACTION_DELETE] El ID de la transacción es obligatorio",
      };
    }

    try {
      const transaction = await this.eBoxTransaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            "[TRANSACTION_DELETE] No se encontró la transacción para eliminar",
        };
      }

      const deleted = await this.$transaction(async (tx) => {
        const deletedTx = await tx.eBoxTransaction.delete({
          where: { id: transaction.id },
        });

        if (transaction.boxId) {
          const dataUpdate = this.getBoxUpdateData(transaction);
          if (Object.keys(dataUpdate).length > 0) {
            await tx.eBoxDaily.update({
              where: { id: transaction.boxId },
              data: dataUpdate,
            });
          }
        }

        return deletedTx;
      });

      return {
        status: HttpStatus.OK,
        message: "[TRANSACTION_DELETE] Transacción eliminada correctamente",
        data: deleted,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `[TRANSACTION_DELETE] No se pudo eliminar esta transacción: ${error}`,
      };
    }
  }

  // Helper: Calcula ajustes de caja al eliminar transacción
  private getBoxUpdateData(transaction: any) {
    switch (transaction.transactionType) {
      case "INCOME_SALE":
      case "INCOME_TRANSFER_BRANCH":
      case "INCOME_FROM_VOUCHER_CANCELLATION":
        return {
          totalSales: { decrement: transaction.amount },
          income: { decrement: transaction.amount },
        };

      case "EXPENSE_FROM_VOUCHER_P_CANCELLATION":
      case "EXPENSE_BY_CATEGORY":
      case "EXPENSE_EMPLOYEED":
      case "EXPENSE_SUPPLIER":
      case "EXPENSE_TRANSFER_BRANCH":
        return {
          totalExpenses: { decrement: transaction.amount },
        };

      default:
        return {};
    }
  }
}
