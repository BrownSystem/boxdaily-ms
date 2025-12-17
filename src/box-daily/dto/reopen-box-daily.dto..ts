import { IsString, IsNumber, IsBoolean, IsOptional } from "class-validator";

export class ReopenBoxDailyDto {
  @IsString()
  id: string;

  @IsString()
  branchId: string;

  @IsString()
  branchName: string;

  @IsString()
  openedBy: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  openingAmount: number;

  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
