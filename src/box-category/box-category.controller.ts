import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { BoxCategoryService } from "./box-category.service";
import { CreateBoxCategoryDto } from "./dto/create-box-category.dto";
import { UpdateBoxCategoryDto } from "./dto/update-box-category.dto";

@Controller()
export class BoxCategoryController {
  constructor(private readonly boxCategoryService: BoxCategoryService) {}

  @MessagePattern({ cmd: "create_box_category" })
  create(@Payload() createBoxCategoryDto: CreateBoxCategoryDto) {
    return this.boxCategoryService.create(createBoxCategoryDto);
  }

  @MessagePattern({ cmd: "find_all_box_category" })
  findAll() {
    return this.boxCategoryService.findAll();
  }

  @MessagePattern({ cmd: "find_one_box_category" })
  findOne(@Payload() payload: { id: string }) {
    return this.boxCategoryService.findOne(payload?.id);
  }

  @MessagePattern({ cmd: "update_box_category" })
  update(@Payload() updateBoxCategoryDto: UpdateBoxCategoryDto) {
    return this.boxCategoryService.update(updateBoxCategoryDto);
  }
}
