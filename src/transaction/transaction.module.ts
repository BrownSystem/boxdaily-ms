import { Module } from "@nestjs/common";
import { NatsModule } from "../transports/nats.module";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";

@Module({
  imports: [NatsModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
