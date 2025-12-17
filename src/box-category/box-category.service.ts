import { Injectable, Logger, HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { UpdateBoxCategoryDto } from "./dto/update-box-category.dto";

@Injectable()
export class BoxCategoryService extends PrismaClient {
  private readonly logger = new Logger(BoxCategoryService.name);

  onModuleInit() {
    void this.$connect();
    this.logger.log("Connected to the database");
  }

  async create(createBoxCategoryDto: any) {
    try {
      const boxCategory = await this.eBoxCategory.create({
        data: {
          ...createBoxCategoryDto,
        },
      });

      return boxCategory;
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `[CREATE_BOX_CATEGORY] Error al crear el banco: ${error.message}`,
      };
    }
  }

  async findAll() {
    return this.eBoxCategory.findMany({
      where: { available: true },
      include: {
        transactions: true,
      },
    });
  }

  async findOne(id: string) {
    try {
      const boxCategory = await this.eBoxCategory.findUnique({
        where: { id, available: true },
        include: {
          transactions: true,
        },
      });

      if (!boxCategory) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: `[BOX_CATEGORY] No exite está categoria.`,
        };
      }

      return boxCategory;
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `[GET_BOX_CATEGORY] Error al obtener: ${error.message}`,
      };
    }
  }

  async update(updateBoxCategoryDto: UpdateBoxCategoryDto) {
    try {
      const { id } = updateBoxCategoryDto;
      const updated = await this.eBoxCategory.update({
        where: { id },
        data: updateBoxCategoryDto,
      });

      return updated;
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `[UPDATE_BOX_CATEGORY] Error al actualizar: ${error.message}`,
      };
    }
  }
}
