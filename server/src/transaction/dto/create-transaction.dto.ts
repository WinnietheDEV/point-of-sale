import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

class TransactionProductDto {
  @IsNotEmpty()
  readonly _id: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @Min(0)
  readonly price: number;

  @IsNumber()
  @Min(1)
  readonly quantity: number;
}

export class CreateTransactionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionProductDto)
  readonly products: TransactionProductDto[];

  @IsNumber()
  @Min(0)
  readonly grandTotal: number;

  @IsEnum(['cash', 'credit/debit', 'e-wallet'])
  readonly paymentMethod: 'cash' | 'credit/debit' | 'e-wallet';

  @IsNumber()
  @Min(0)
  readonly pay: number;

  @IsNumber()
  @Min(0)
  readonly change: number;
}
