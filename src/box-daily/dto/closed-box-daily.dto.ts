import { IsString, IsNumber } from "class-validator";

export class ClosedBoxDailyDto {
  @IsString()
  id: string;

  @IsString()
  branchId: string;

  @IsString()
  branchName: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  closingAmount: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  realAmount: number;

  @IsString()
  closedBy: string;
}
