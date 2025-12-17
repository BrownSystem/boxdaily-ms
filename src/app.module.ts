import { Module } from "@nestjs/common";

import { BoxDailyModule } from "./box-daily/box-daily.module";
import { BoxCategoryModule } from "./box-category/box-category.module";
import { TransactionModule } from "./transaction/transaction.module";

@Module({
  imports: [BoxCategoryModule, BoxDailyModule, TransactionModule],
})
export class AppModule {}
