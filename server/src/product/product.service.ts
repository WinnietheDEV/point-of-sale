import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().select('name price ordered').exec();
  }

  async createProduct(): Promise<Product> {
    const entry = new this.productModel({
      name: 'VS assasin 47',
      description:
        'A professional badminton racket tailored to those who serious about badminton',
      stock: 72,
      price: 2200,
      ordered: 0,
    });
    return entry.save(); // This will create the collection + DB if they don't exist
  }
}
