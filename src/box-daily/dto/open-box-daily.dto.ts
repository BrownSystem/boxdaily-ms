import {
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { BoxStatus } from "../../enum/status.enum";

export class OpenBoxDailyDto {
  @IsString()
  branchId: string;

  @IsString()
  branchName: string;

  @IsString()
  openedBy: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  openingAmount: number;

  @IsEnum(BoxStatus)
  @IsOptional()
  status?: BoxStatus;

  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
