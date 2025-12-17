import { Injectable, Logger, HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { BoxStatus } from "../enum/status.enum";
import { OpenBoxDailyDto } from "./dto/open-box-daily.dto";
import { ReopenBoxDailyDto } from "./dto/reopen-box-daily.dto.";
import { FilterExpenseDto } from "./dto/filter-expense.dto";
import { ClosedBoxDailyDto } from "./dto/closed-box-daily.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { TransactionType } from "src/enum/transaction.type.enum";

@Injectable()
export class BoxDailyService extends PrismaClient {
  private readonly logger = new Logger(BoxDailyService.name);

  onModuleInit() {
    void this.$connect();
    this.logger.log("Connected to the database");
  }

  async findAllBoxDaily(paginationDto: PaginationDto) {
    try {
      const { limit, offset, number, branch, dateFrom, dateUntil, status } =
        paginationDto;

      const whereClause: any = {
        available: true,
        status,
      };

      if (branch) {
        whereClause.OR = [
          { branchName: { contains: branch, mode: "insensitive" } },
          { branchId: { contains: branch, mode: "insensitive" } },
        ];
      }

      if (dateFrom || dateUntil) {
        whereClause.closedAt = {};
        if (dateFrom) whereClause.closedAt.gte = dateFrom;
        if (dateUntil) whereClause.closedAt.lte = dateUntil;
      }

      if (number) {
        whereClause.number = number;
      }

      const boxDaily = await this.eBoxDaily.findMany({
        where: whereClause,
        take: limit,
        skip: (offset - 1) * limit,
        include: {
          transactions: true,
        },
        orderBy: [{ closedAt: "desc" }, { number: "desc" }],
      });

      return boxDaily;
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `[FIND_ALL_BOX_DAILY] Error al traer las cajas: ${error.message}`,
      };
    }
  }

  async findOneBoxDaily(id: string) {
    try {
      const boxDaily = await this.eBoxDaily.findFirst({
        where: {
          branchId: id,
          status: "OPEN",
          available: true,
        },
        include: {
          transactions: true,
        },
      });

      if (!boxDaily) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: `[FIND_ONE_BOX_DAILY] No se encontro la caja #${id}`,
        };
      }

      return boxDaily;
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `[FIND_ONE_BOX_DAILY] Error al retornar la caja buscada: ${error.message}`,
      };
    }
  }

  async openBoxDaily(openBoxDailyDto: OpenBoxDailyDto) {
    try {
      const { branchId } = openBoxDailyDto;

      const thereIsAnopenBox = await this.eBoxDaily.findFirst({
        where: {
          available: true,
          branchId,
          status: BoxStatus.OPEN,
        },
      });

      if (thereIsAnopenBox) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: `[OPEN_BOX_DAILY] No puedes abrir otra caja, por que ya existe una. #${thereIsAnopenBox?.number} /id: ${thereIsAnopenBox?.id}`,
        };
      }

      const boxDaily = await this.eBoxDaily.create({
        data: {
          ...openBoxDailyDto,
        },
      });

      return boxDaily;
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `[OPEN_BOX_DAILY] Error al abrir la caja: ${error.message}`,
      };
    }
  }

  async closedBoxDaily(closedBoxDailyDto: ClosedBoxDailyDto) {
    try {
      const { id, closingAmount, realAmount, branchId, closedBy } =
        closedBoxDailyDto;

      const thereIsAnOpenBox = await this.eBoxDaily.findFirst({
        where: {
          id,
          available: true,
          branchId,
          status: BoxStatus.OPEN,
        },
      });

      if (!thereIsAnOpenBox) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: `[CLOSED_BOX_DAILY] Error al cerrar la caja: No coincide con la base de datos.`,
        };
      }

      const updateBoxDaily = await this.eBoxDaily.update({
        where: {
          id,
          branchId,
          status: BoxStatus.OPEN,
        },
        data: {
          closingAmount,
          realAmount,
          status: BoxStatus.CLOSED,
          closedBy,
        },
      });

      return updateBoxDaily;
    } catch (error: any) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `[CLOSED_BOX_DAILY] Error al cerrar la caja: ${error.message}`,
      };
    }
  }

  async reopenBoxDaily(reopenBoxDailyDto: ReopenBoxDailyDto) {
    try {
      const { id, branchId, openedBy, openingAmount } = reopenBoxDailyDto;

      const thereIsAnOpenBox = await this.eBoxDaily.findFirst({
        where: {
          branchId,
          available: true,
          status: BoxStatus.OPEN,
        },
      });

      if (thereIsAnOpenBox) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: `[CLOSED_BOX_DAILY] Error al Reabrir la caja: Cerrar la caja actual número #${thereIsAnOpenBox?.number} .`,
        };
      }

      const updateBoxDaily = await this.eBoxDaily.update({
        where: {
          id,
          branchId,
          status: BoxStatus.CLOSED,
        },
        data: {
          openedBy,
          openingAmount,
          status: BoxStatus.OPEN,
        },
      });

      return updateBoxDaily;
    } catch (error: any) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `[CLOSED_BOX_DAILY] Error al cerrar la caja: ${error.message}`,
      };
    }
  }

  async findExpensesByBranchAndDate(filterDto: FilterExpenseDto) {
    try {
      const { branchId, month, year, transactionType } = filterDto;

      const dateFrom = new Date(year, month - 1, 1);
      const dateUntil = new Date(year, month, 0, 23, 59, 59, 999);

      const expenseTypes: TransactionType[] = [
        "EXPENSE_FROM_VOUCHER_P_CANCELLATION" as TransactionType,
        "EXPENSE_BY_CATEGORY" as TransactionType,
        "EXPENSE_EMPLOYEED" as TransactionType,
        "EXPENSE_SUPPLIER" as TransactionType,
        "EXPENSE_TRANSFER_BRANCH" as TransactionType,
      ];

      const typesToFilter: TransactionType[] = transactionType
        ? [transactionType as TransactionType]
        : expenseTypes;

      const transactions = await this.eBoxTransaction.findMany({
        where: {
          transactionType: { in: typesToFilter },
          box: {
            branchId,
            openedAt: {
              gte: dateFrom,
              lte: dateUntil,
            },
            available: true,
          },
          available: true,
        },
        include: {
          box: {
            select: {
              id: true,
              number: true,
              openedAt: true,
              branchName: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const totalAmount = transactions.reduce(
        (acc, t) => acc + Number(t.amount),
        0
      );

      const groupMap: Record<string, { total: number; count: number }> = {};

      for (const t of transactions) {
        const groupKey =
          t.categoryName ||
          t.category?.name ||
          this.formatTransactionType(t.transactionType);

        if (!groupMap[groupKey]) {
          groupMap[groupKey] = { total: 0, count: 0 };
        }

        groupMap[groupKey].total += Number(t.amount);
        groupMap[groupKey].count += 1;
      }

      const groupedExpenses = Object.entries(groupMap)
        .map(([group, { total, count }]) => {
          const abbreviation = group
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase();

          return {
            group,
            abbreviation,
            total,
            count,
            percentage: totalAmount
              ? Number(((total / totalAmount) * 100).toFixed(2))
              : 0,
          };
        })
        .sort((a, b) => b.total - a.total);

      return {
        branchId,
        period: `${month}/${year}`,
        totalAmount,
        totalTransactions: transactions.length,
        groupedExpenses,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `[FIND_EXPENSES_BY_BRANCH_AND_DATE] Error al filtrar y agrupar gastos: ${error.message}`,
      };
    }
  }

  private formatTransactionType(type: string): string {
    switch (type) {
      case "EXPENSE_FROM_VOUCHER_P_CANCELLATION":
        return "CANCELACIÓN DE P.";
      case "EXPENSE_BY_CATEGORY":
        return "Gasto por categoría";
      case "EXPENSE_EMPLOYEED":
        return "GASTO POR EMPLEADO (VALE)";
      case "EXPENSE_SUPPLIER":
        return "GASTO POR PAGO A PROVEEDOR";
      case "EXPENSE_TRANSFER_BRANCH":
        return "GASTO POR TRANSFERENCIA A SUCURSAL";
      default:
        return type;
    }
  }
}
