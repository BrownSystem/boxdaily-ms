import { Module } from "@nestjs/common";
import { BoxCategoryController } from "./box-category.controller";
import { BoxCategoryService } from "./box-category.service";

@Module({
  controllers: [BoxCategoryController],
  providers: [BoxCategoryService],
})
export class BoxCategoryModule {}
