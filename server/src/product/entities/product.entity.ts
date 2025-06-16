import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description?: string;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
