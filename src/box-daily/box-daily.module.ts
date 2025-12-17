import { Module } from "@nestjs/common";
import { BoxDailyController } from "./box-daily.controller";
import { BoxDailyService } from "./box-daily.service";

@Module({
  controllers: [BoxDailyController],
  providers: [BoxDailyService],
})
export class BoxDailyModule {}
