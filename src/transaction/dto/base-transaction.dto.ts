import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentMethod } from "../../enum/payment-method.enum";

export class BaseTransactionDto {
  @IsString()
  boxId: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  currency: string;

  @IsString()
  @IsOptional()
  paymentId?: string;
}
