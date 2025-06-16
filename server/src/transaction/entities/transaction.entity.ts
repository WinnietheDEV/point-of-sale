import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({
    type: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    required: true,
  })
  products: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  @Prop({ required: true, min: 0 })
  grandTotal: number;

  @Prop({ required: true, enum: ['cash', 'credit', 'debit', 'e-wallet'] })
  paymentMethod: string;

  @Prop({ required: true, min: 0 })
  pay: number;

  @Prop({ required: false, min: 0, default: 0 })
  change: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
