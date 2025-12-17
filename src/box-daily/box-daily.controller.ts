import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { BoxDailyService } from "./box-daily.service";
import { ClosedBoxDailyDto } from "./dto/closed-box-daily.dto";
import { OpenBoxDailyDto } from "./dto/open-box-daily.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { FilterExpenseDto } from "./dto/filter-expense.dto";
import { ReopenBoxDailyDto } from "./dto/reopen-box-daily.dto.";

@Controller()
export class BoxDailyController {
  constructor(private readonly boxDailyService: BoxDailyService) {}

  @MessagePattern({ cmd: "find_all_box_daily" })
  findAllBoxDaily(@Payload() paginationDto: PaginationDto) {
    return this.boxDailyService.findAllBoxDaily(paginationDto);
  }

  @MessagePattern({ cmd: "find_one_box_daily" })
  finOneBoxDaily(@Payload() payload: { id: string }) {
    return this.boxDailyService.findOneBoxDaily(payload?.id);
  }

  @MessagePattern({ cmd: "open_box_daily" })
  openBoxDaily(@Payload() openBoxDailyDto: OpenBoxDailyDto) {
    return this.boxDailyService.openBoxDaily(openBoxDailyDto);
  }

  @MessagePattern({ cmd: "closed_box_daily" })
  closedBoxDaily(@Payload() closedBoxDailyDto: ClosedBoxDailyDto) {
    return this.boxDailyService.closedBoxDaily(closedBoxDailyDto);
  }

  @MessagePattern({ cmd: "reopen_box_daily" })
  reopenBoxDaily(@Payload() reopenBoxDailyDto: ReopenBoxDailyDto) {
    return this.boxDailyService.reopenBoxDaily(reopenBoxDailyDto);
  }

  @MessagePattern({ cmd: "find_expenses_by_branch_and_date" })
  findExpensesByBranchAndDate(@Payload() filterDto: FilterExpenseDto) {
    return this.boxDailyService.findExpensesByBranchAndDate(filterDto);
  }
}
